const express = require("express");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();
router.use(express.json());

// ========================= CHECK RESERVED =========================

router.post("/getReservedTrip", async (req, res) => {
  try {
    const { userId, rackId } = req.body;
    const reservedTripsSnapshot = await db
      .collection("trips")
      .where("userId", "==", userId)
      .where("status", "==", "reserved")
      .get();

    if (reservedTripsSnapshot.empty) {
      return res.status(200).json(null); // No active reservation
    }

    for (const tripDoc of reservedTripsSnapshot.docs) {
      const tripData = tripDoc.data();
      const bikeSnap = await db.collection("bikes").doc(tripData.bikeId).get();

      if (!bikeSnap.exists) continue;

      const bikeData = bikeSnap.data();
      if (bikeData.rackId === rackId) {
        return res
          .status(200)
          .json({ id: tripDoc.id, ...tripData, rackSlot: bikeData.rackSlot });
      }
    }
    // If none of the reserved trips are at the given rack
    return res.status(403).json({ message: "No reserved trip at this rack" });
  } catch (err) {
    console.error("Error fetching reserved trip:", err);
    return res.status(500).json({ error: "Failed to fetch reserved trip" });
  }
});

// ========================= DELETE RESERVED =========================
router.post("/deleteReservedTrip", async (req, res) => {
  try {
    const { bikeId, userId, tripId } = req.body;

    if (!bikeId || !userId || !tripId) {
      return res
        .status(400)
        .json({ error: "Missing bikeId, userId or tripId" });
    }

    // get trip by params
    const tripRef = db.collection("trips").doc(tripId);
    const tripSnap = await tripRef.get();

    if (!tripSnap.exists || tripSnap.data().status !== "reserved") {
      return res.status(404).json({ error: "Reserved trip not found" });
    }

    // get bike and user
    const bikeRef = db.collection("bikes").doc(bikeId);
    const userRef = db.collection("users").doc(userId);

    // update bike and user
    await bikeRef.update({
      status: "available",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await userRef.update({
      currentTrip: "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // delete trip
    await tripRef.delete();

    return res.status(200).json({ message: "Reserved trip deleted!" });
  } catch (err) {
    console.error("Error fetching reserved trip:", err);
    return res.status(500).json({ error: "Failed to fetch reserved trip" });
  }
});

module.exports = router;
