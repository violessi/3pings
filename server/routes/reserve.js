const express = require("express");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();
router.use(express.json());

// ========================= CHECK RESERVED =========================

router.get("/getReservedTrip/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const reservedTripsSnapshot = await db
      .collection("trips")
      .where("userId", "==", userId)
      .where("status", "==", "reserved")
      .limit(1)
      .get();

    if (reservedTripsSnapshot.empty) {
      return res.status(200).json(null); // No active reservation
    }

    const doc = reservedTripsSnapshot.docs[0];
    const data = doc.data();

    return res.status(200).json({
      id: doc.id,
      ...data,
      startTime: data.startTime?.toDate?.() ?? null,
      createdAt: data.createdAt?.toDate?.() ?? null,
      updatedAt: data.updatedAt?.toDate?.() ?? null,
    });
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
      return res.status(400).json({ error: "Missing bikeId, userId or tripId" });
    }

    // get trip by params
    const tripRef   = db.collection("trips").doc(tripId);
    const tripSnap  = await tripRef.get();

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