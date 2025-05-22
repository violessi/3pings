const express = require("express");
const { admin, db } = require("../config/firebaseAdmin");

const router = express.Router();
router.use(express.json());

const ESP32_IP = "http://10.147.40.116:1234";

// ========================= SERVER TO DB =========================

router.get("/getRack/:rackId", async (req, res) => {
  try {
    const rackId = req.params.rackId;
    const rackRef = db.collection("racks").doc(rackId);
    const rackDoc = await rackRef.get();

    if (!rackDoc.exists) {
      res.status(200).json({ message: false });
    } else {
      res.status(200).json({ message: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check rack" });
  }
});

router.post("/preCheck", async (req, res) => {
  try {
    const { userId } = req.body;

    // USE RACKID to check reservations in that rack
    // check if current reservations ACROSS ALL RACKS AND USERS are still valid
    // set cutoff for valid reservations (expiry = N_MINS ago)
    const now = Date.now();
    const N_MINUTES = 3;
    const expiryCutoff = new Date(now - N_MINUTES * 60 * 1000);

    const reservedTripsRef = db
      .collection("trips")
      .where("status", "==", "reserved");
    const reservedTripsSnap = await reservedTripsRef.get();
    const batch = db.batch();

    // if not (if res made more than N_MINS ago)
    // update trip status and make bike available
    reservedTripsSnap.forEach((doc) => {
      const trip = doc.data();
      const reservedAt = trip.createdAt?.toDate?.();

      if (reservedAt && reservedAt <= expiryCutoff) {
        const tripRef = doc.ref;
        batch.update(tripRef, { status: "cancelled" });
        const bikeRef = db.collection("bikes").doc(trip.bikeId);
        batch.update(bikeRef, { status: "available" });
      }
    });

    if (!batch._ops || batch._ops.length > 0) {
      await batch.commit();
      console.log(`[CLEANUP] Expired ${reservedTripsSnap.size} reservations`);
    }

    // USE USERID check if user has an active trip
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ allowed: false, reason: "User not found" });
    }

    const userData = userDoc.data();
    const activeTripId = userData.currentTrip;
    if (activeTripId && activeTripId !== "") {
      return res.status(200).json({
        allowed: false,
        reason: "User already has an active trip",
      });
    }

    // USE USERID check if user has too many penalties
    const penaltySnap = await db
      .collection("trips")
      .where("userId", "==", userId)
      .where("paid", "==", false)
      .get();

    let totalPenalty = 0;
    penaltySnap.forEach((doc) => {
      const data = doc.data();
      totalPenalty += data.finalFee ?? 0;
    });

    const MAX_PENALTY = 50; // MAX PENALTY HARDCODED
    console.log(totalPenalty);
    if (totalPenalty >= MAX_PENALTY) {
      return res
        .status(200)
        .json({ allowed: false, reason: "Penalty limit exceeded" });
    }

    return res.status(200).json({ allowed: true });
  } catch (error) {
    console.error("Rental eligibility check failed:", error);
    res.status(500).json({
      allowed: false,
      reason: "Internal server error",
    });
  }
});

router.get("/getAvailableBikes/:rackId", async (req, res) => {
  try {
    const rackId = req.params.rackId;

    const bikesRef = db
      .collection("bikes")
      .where("rackId", "==", rackId)
      .where("status", "==", "available");
    const snapshot = await bikesRef.get();
    console.log(`[CHECK Rent] Found ${snapshot.size} bikes for rack ${rackId}`);

    const availableBikes = [];
    snapshot.forEach((doc) => {
      const data = doc.data();

      availableBikes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.() ?? null,
      });
    });

    if (availableBikes.length === 0) {
      return res.status(200).json({ message: false });
    } else {
      res.status(200).json({ message: true, availableBikes });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get available bikes" });
  }
});

router.post("/createTrip", async (req, res) => {
  try {
    const {
      bikeId,
      userId,
      status,
      baseRate,
      startTime,
      reservedTripId,
      startRack,
      endRack,
      paid,
    } = req.body;
    const isReservation = status === "reserved"; // set if reserving a new trip

    // check if bike and user exist
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const bikeRef = db.collection("bikes").doc(bikeId);
    const bikeDoc = await bikeRef.get();
    if (!bikeDoc.exists) {
      return res.status(404).json({ error: "Bike not found" });
    }

    // IF user has reserved bike at that rack, set bike
    if (reservedTripId) {
      const reservedTripRef = db.collection("trips").doc(reservedTripId);
      const reservedTripDoc = await reservedTripRef.get();

      if (!reservedTripDoc.exists) {
        return res.status(404).json({ error: "Reserved trip not found" });
      }

      // update reserved trip to active
      await reservedTripRef.update({
        status: "active",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        startTime: admin.firestore.FieldValue.serverTimestamp(),
      });

      // update bike status
      await bikeRef.update({
        status: "getting",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      // update user to have a trip
      // add trip ID to user regardless if reserve or rent
      await userRef.update({
        currentTrip: reservedTripRef.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res
        .status(200)
        .json({ message: "Reserved trip updated to active!" });
    } else {
      // ELSE, make a new trip
      // initialize new trip fields
      // set start time if not reservation
      const newTripData = {
        bikeId,
        userId,
        status,
        baseRate,
        startTime,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        startRack,
        endRack,
      };

      if (isReservation) {
        if (!startTime)
          return res
            .status(400)
            .json({ error: "startTime required for reservation" });

        const parsedStartTime = admin.firestore.Timestamp.fromDate(
          new Date(startTime)
        );
        newTripData.startTime = parsedStartTime;
      } else {
        newTripData.startTime = admin.firestore.FieldValue.serverTimestamp();
      }

      const newTripRef = await db.collection("trips").add(newTripData);
      await newTripRef.update({ id: newTripRef.id });

      // update bike status
      await bikeRef.update({
        status: isReservation ? "reserved" : "getting",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      if (!isReservation) {
        await userRef.update({
          currentTrip: newTripRef.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    res.status(200).json({ message: "Done creating trip!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

// ========================= SERVER TO HARDWARE =========================

router.post("/hardwareRequest", async (req, res) => {
  try {
    const { bikeId } = req.body;
    console.log(`[SERVER] Pinging ESP32 for bike ${bikeId}...`);

    // check if esp32 is reachable
    const pingResponse = await fetch(`${ESP32_IP}/ping`, {
      method: "GET",
    });

    const pingResult = await pingResponse.text();
    console.log(`[SERVER] ESP32 ping response: ${pingResult}`);

    if (!pingResponse.ok) {
      return res.status(404).json({ error: "Hardware unreachable" });
    }

    // if reachable, proceed to unlock the bike
    const unlockResponse = await fetch(`${ESP32_IP}/rent`, {
      method: "POST",
      headers: {
        "Content-Type": "plain/text",
      },
      body: bikeId,
    });

    const unlockResult = await unlockResponse.text();
    console.log(`[SERVER] Unlock response from ESP32: ${unlockResult}`);

    if (!unlockResponse.ok) {
      return res.status(400).json({ error: "Unlock unsuccessful" });
    }

    const bikeRef = db.collection("bikes").doc(bikeId);
    await bikeRef.update({
      status: "rented",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      rackId: null,
      rackSlot: null,
    });

    res.status(200).json({
      message: "Bike pinged and unlock request sent to ESP32",
      // pingResult,
      // unlockResult,
    });
  } catch (err) {
    console.error("[SERVER] Error during hardwareRequest:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ========================= HARDWARE TO SERVER =========================

router.post("/bikeRented", async (req, res) => {
  try {
    const { bikeId } = req.body;

    // update bike status
    const bikeRef = db.collection("bikes").doc(bikeId);
    await bikeRef.update({
      status: "rented",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      rackId: null,
      rackSlot: null,
    });

    res.status(200).json({ message: "Bike rented successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update bike status" });
  }
});

// // Fire off ping request to ESP32
// router.post("/hardwareRequest", async (req, res) => {
//   console.log("[SERVER] Sending ping request to ESP32...");

//   try {
//     const response = await fetch("http://10.147.40.142:1234/ping", {
//       method: "POST",
//       headers: {
//         "Content-Type": "text/plain", // fixed from "plain/text"
//       },
//       body: "ping, hello",
//     });

//     const data = await response.json(); // Only do this if you know ESP32 sends JSON
//     console.log("[SERVER] ESP32 ping response:", data);

//     res.status(200).json({ message: "Ping request sent to ESP32.", data });
//   } catch (err) {
//     console.error("[SERVER] Error during hardwareRequest:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/ping", (req, res) => {
//   const { ack } = req.body;

//   console.log(`[SERVER] Received ack from ESP32: ${ack}`);
//   res.status(200).json({ message: "Ping acknowledged by ESP32" });
// });

module.exports = router;
