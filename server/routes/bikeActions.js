const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// POST /api/action/avail
router.post("/avail", async (req, res) => {
  try {
    const newTrip = {
      bikeID: Math.floor(Math.random() * 100),
      startRack: "Station A",
      startTime: new Date(),
      status: "In Use",
    };

    await db.collection("activeTrips").add(newTrip);
    res.status(200).json({ message: "Bike availed!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to avail bike" });
  }
});

// POST /api/action/return
router.post("/return", async (req, res) => {
  try {
    const snapshot = await db.collection("activeTrips").get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No active trips" });
    }

    const firstTrip = snapshot.docs[0];
    const tripData = firstTrip.data();

    const completedTrip = {
      ...tripData,
      endRack: "Station B",
      endTime: new Date(),
      status: "Paid",
    };

    await db.collection("completedTrips").add(completedTrip);
    await db.collection("activeTrips").doc(firstTrip.id).delete();

    res.status(200).json({ message: "Bike returned!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to return bike" });
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