const express = require("express");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();
router.use(express.json());

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
    const { bikeId, userId, status, baseRate, startTime, reservedTripId } = req.body;
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

      return res.status(200).json({ message: "Reserved trip updated to active!" });
    } else {
      // ELSE, make a new trip
      // initialize new trip fields
      // set start time if not reservation
      const newTripData = {
        bikeId,
        userId,
        status,
        baseRate,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        // startRack: rackId,
      };

      if (isReservation) {
        if (!startTime) return res.status(400).json({ error: "startTime required for reservation" });

        const parsedStartTime = admin.firestore.Timestamp.fromDate(new Date(startTime));
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

      // update user to have a trip
      // add trip ID to user regardless if reserve or rent
      await userRef.update({
        currentTrip: newTripRef.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }    

    res.status(200).json({ message: "Done creating trip!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

// router.get("/getRackId/:tripId", async (req, res) => {
//   const { tripId } = req.params;
//   console.log(tripId);

//   try {
//     // Step 1: Get the trip doc
//     const tripSnap = await db.collection("trips").doc(tripId).get();
//     if (!tripSnap.exists) {
//       console.log(`Trip ${tripId} not found`);
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     const tripData = tripSnap.data();
//     const bikeId = tripData?.bikeId;

//     if (!bikeId) {
//       return res.status(400).json({ message: "Trip has no bikeId" });
//     }

//     // Step 2: Get the bike doc
//     const bikeSnap = await db.collection("bikes").doc(bikeId).get();
//     if (!bikeSnap.exists) {
//       return res.status(404).json({ message: "Bike not found" });
//     }

//     const bikeData = bikeSnap.data();
//     const rackId = bikeData?.rackId;

//     if (!rackId) {
//       return res.status(400).json({ message: "Bike has no rackId" });
//     }

//     return res.status(200).json({ rackId });
//   } catch (err) {
//     console.error("Error in getRackFromBike:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });


// ========================= SERVER TO HARDWARE =========================

router.get("/pingHardware", async (req, res) => {});
router.post("/unlockBike", async (req, res) => {});

module.exports = router;
