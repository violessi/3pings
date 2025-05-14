const express = require("express");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  console.log("GET /api/rent/ hit");
  try {
    res.status(200).json({ message: "Rent API is working!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// ========================= SERVER TO DB =========================

router.get("/getRack/:rackId", async (req, res) => {
  try {
    const rackId = req.params.rackId;
    const rackRef = db.collection("racks").doc(rackId);
    const rackDoc = await rackRef.get();

    if (!rackDoc.exists) {
      res.status(200).json({ message: false });
    }

    res.status(200).json({ message: true });
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
    }

    res.status(200).json({ message: true, availableBikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get available bikes" });
  }
});

router.post("/createTrip", async (req, res) => {
  try {
    const { bikeId, userId, status, baseRate } = req.body;

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

    // create a new trip
    const newTrip = await db.collection("tripsTest").add({
      bikeId,
      userId,
      status,
      baseRate,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      startTime: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await newTrip.update({ id: newTrip.id });

    // update bike status
    await bikeRef.update({
      status: "getting",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // update user to have a trip
    await userRef.update({
      currentTrip: newTrip.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Done creating trip!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

// ========================= SERVER TO HARDWARE =========================

module.exports = router;
