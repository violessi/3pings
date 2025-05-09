const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// POST /api/action/avail
// make a new trip with intial fields first
router.post("/avail", async (req, res) => {
  try {
    const newTrip = {
      bike_id: Math.floor(Math.random() * 100),
      start_time: new Date(),
      status: "active",
    };

    await db.collection("trips").add(newTrip);
    res.status(200).json({ message: "Bike availed!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to avail bike" });
  }
});

// POST /api/action/return
// update trip
router.post("/return", async (req, res) => {
  try {
    const snapshot = await db
      .collection("trips")
      .where("status", "in", ["reserved", "active"])
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No active/reserved trips found" });
    }

    const tripDoc = snapshot.docs[0];
    const tripRef = db.collection("trips").doc(tripDoc.id);

    await tripRef.update({
      end_time: new Date(),
      status: "completed", // or "cancelled" depending on user action
    });

    res.status(200).json({ message: "Bike returned!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to return bike" });
  }
});

// POST /api/bikeActions/reserve
router.post("/reserve", async (req, res) => {
  try {
    const { bike_id, user_id, date, time } = req.body;

    // Combine date and time into a proper timestamp if provided
    const reservationStart = date && time ? new Date(`${date}T${time}:00`) : new Date();

    const newTrip = {
      bike_id: bike_id || Math.floor(Math.random() * 100), // fallback to mock ID
      user_id: user_id || "anonymous", // fallback if no user provided
      start_time: reservationStart,
      status: "reserved",
      created_at: new Date(),
    };

    await db.collection("trips").add(newTrip);
    res.status(200).json({ message: "Bike reserved!" });
  } catch (err) {
    console.error("Reserve Error:", err);
    res.status(500).json({ error: "Failed to reserve bike" });
  }
});

module.exports = router;

/*
const handleAvail = async () => {
    try {
      const newTrip = {
        bikeID: Math.floor(Math.random() * 100), // Random bikeID
        startRack: "Station A", // change to current rack read from rfid
        startTime: new Date(), // take current timestamp
        status: "In Use",
      };

      // add logic to verify user
      await addDoc(collection(db, "activeTrips"), newTrip);
      Alert.alert("Bike availed!");
      router.replace("/trips");
    } catch (error) {
      console.error("Error availing bike:", error);
    }
  };

  const handleReturn = async () => {
    try {
      const activeSnapshot = await getDocs(collection(db, "activeTrips"));

      if (activeSnapshot.empty) {
        Alert.alert("No active trips to return.");
        return;
      }

      // add logic to verify bike to firstTrip
      // if not matching bike ID, do not allow return
      const firstTrip = activeSnapshot.docs[0]; // Simulate returning the first active trip
      const tripData = firstTrip.data();

      const completedTrip = {
        ...tripData,
        endRack: "Station B", // change to current rack read from rfid
        endTime: new Date(), // take current timestamp
        status: "Paid", // need to double check with actual payment
      };

      // transfer from active to completed
      await addDoc(collection(db, "completedTrips"), completedTrip);
      await deleteDoc(doc(db, "activeTrips", firstTrip.id));
      Alert.alert("Bike returned!");
      router.replace("/trips");
    } catch (error) {
      console.error("Error returning bike:", error);
    }
  };
*/