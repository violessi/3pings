const { admin, db } = require("../config/firebaseAdmin");

const RACK_THRESHOLD = 5; // Max bikes per rack
const RATE_INTERVAL = 15; // Billing interval in minutes
const ESP32_BASE_URL = "http://10.147.40.116:1234";

// Handle initial return request
async function requestBikeReturn(req, res) {
  const { userId, rackId } = req.body;

  try {
    // Fetch user
    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnapshot.data();
    const currentTrip = userData.currentTrip;
    if (!userData.currentTrip) {
      return res.status(400).json({ error: "No active trip found" });
    }

    // Validate rack
    const rackRef = db.collection("racks").doc(rackId);
    const rackSnapshot = await rackRef.get();

    if (!rackSnapshot.exists) {
      return res.status(404).json({ error: "Rack not found" });
    }

    const bikesAtRack = await db
      .collection("bikes")
      .where("rackId", "==", rackId)
      .get();

    if (bikesAtRack.size >= RACK_THRESHOLD) {
      return res.status(400).json({ error: "Rack is full" });
    }

    // Get trip data
    const tripRef = db.collection("trips").doc(userData.currentTrip);
    const tripSnapshot = await tripRef.get();

    if (!tripSnapshot.exists) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const tripData = tripSnapshot.data();

    // Mark bike as returning
    const bikeRef = db.collection("bikes").doc(tripData.bikeId);
    await bikeRef.update({
      status: "returning",
      rackId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`[SERVER] Bike ${tripData.bikeId} marked as returning`);

    // check if ESP32 is reachable
    const pingResponse = await fetch(`${ESP32_BASE_URL}/ping`, {
      method: "GET",
    });

    const pingResult = await pingResponse.json();
    console.log(`[SERVER] ESP32 ping response: ${pingResult}`);

    if (!pingResponse.ok) {
      return res.status(404).json({ error: "Hardware unreachable" });
    }

    // if reachable, proceed to unlock the bike
    const lockResponse = await fetch(`${ESP32_BASE_URL}/return`, {
      method: "POST",
      headers: {
        "Content-Type": "plain/text",
      },
      body: tripData.bikeId,
    });

    if (!lockResponse.ok) {
      return res.status(400).json({ error: "Unlock unsuccessful" });
    }

    const rackSlot = await lockResponse.text();
    console.log(`[SERVER] Unlock response from ESP32: ${rackSlot}`);

    const startTime = tripData.startTime.toDate();
    const endTime = new Date();
    console.log("End time:", endTime.toISOString());

    // Check if endTime is later than 10 PM
    const tenPM = new Date(endTime);
    tenPM.setUTCHours(14, 0, 0, 0);
    const endedAfter10PM = endTime > tenPM;

    const addtlFee = endedAfter10PM ? 100 : 0; // Additional fee if returned after 10 PM
    const durationMinutes = Math.ceil((endTime - startTime) / (1000 * 60));
    const finalFee =
      Math.ceil(durationMinutes / RATE_INTERVAL) * tripData.baseRate + addtlFee;

    // Update trip
    await tripRef.update({
      status: "completed",
      addtlFee,
      finalFee,
      endRack: rackId,
      endTime: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      paid: false,
    });

    // Update bike
    await bikeRef.update({
      status: "available",
      rackId,
      rackSlot: parseInt(rackSlot),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user
    await userRef.update({
      balance: admin.firestore.FieldValue.increment(finalFee),
      currentTrip: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`[SERVER] Bike ${tripData.bikeId} returned successfully`);

    res.status(200).json({
      message: "Bike returned successfully",
      bikeId: tripData.bikeId,
      tripId: currentTrip,
      finalFee,
      endedAfter10PM,
    });
  } catch (err) {
    console.error("[ERROR] requestBikeReturn:", err);
    res.status(500).json({ error: "Failed to process return request" });
  }
}

// Finalize return after terminal confirmation
async function completeBikeReturn(req, res) {
  const { userId, rackId, rackSlot } = req.body;

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnapshot.data();
    if (!userData.currentTrip) {
      return res.status(400).json({ error: "No active trip found" });
    }

    const tripRef = db.collection("trips").doc(userData.currentTrip);
    const tripSnapshot = await tripRef.get();

    if (!tripSnapshot.exists) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const tripData = tripSnapshot.data();
    const startTime = tripData.startTime.toDate();
    const endTime = new Date();
    const durationMinutes = Math.ceil((endTime - startTime) / (1000 * 60));
    const finalFee =
      Math.ceil(durationMinutes / RATE_INTERVAL) * tripData.baseRate;

    // Update trip
    await tripRef.update({
      status: "completed",
      finalFee,
      endRack: rackId,
      endTime: admin.firestore.FieldValue.serverTimestamp(),
      rateInterval: RATE_INTERVAL,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update bike
    const bikeRef = db.collection("bikes").doc(tripData.bikeId);
    await bikeRef.update({
      status: "available",
      rackId,
      rackSlot,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user
    await userRef.update({
      balance: admin.firestore.FieldValue.increment(finalFee),
      currentTrip: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`[SERVER] Bike ${tripData.bikeId} returned successfully`);
    res.status(200).json({ message: "Bike returned successfully", finalFee });
  } catch (err) {
    console.error("[ERROR] completeBikeReturn:", err);
    res.status(500).json({ error: "Failed to complete return" });
  }
}

module.exports = { requestBikeReturn, completeBikeReturn };
