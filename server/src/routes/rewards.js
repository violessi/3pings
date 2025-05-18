const express = require("express");
const { admin, db } = require("../config/firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.post("/verify", async (req, res) => {
  const { userId, rewardId } = req.body;
  console.log(`[SERVER] Verifying reward '${rewardId}' for user ${userId}`);

  try {
    // each reward from rewards collection has a reqs array
    // reqs[0] = time, reqs[1] = day of the week, reqs[2] = rack name
    // also a timeLowerReq and timeUpperReq for raw 24-h numbers for time

    // get reward doc details
    const rewardRef = db.collection("rewards").doc(rewardId);
    const rewardSnap = await rewardRef.get();

    if (!rewardSnap.exists) {
      return res.status(404).json({ error: "Reward not found" });
    }

    const rewardData = rewardSnap.data();
    const { reqs, timeLowerReq, timeUpperReq, targetRack, prize} = rewardData;
    const targetDay = reqs[1]; 

    // Get user doc to access rewardTrips
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = userSnap.data();
    const alreadyClaimedTripIds = userData.rewardTrips || [];

    // get user completed trips
    const tripsSnap = await db
      .collection("trips")
      .where("userId", "==", userId)
      .where("status", "==", "completed")
      .get();

    // check if tripEnd within [timeLowerReq, timeUpperReq]
    // check if tripEnd in day of week
    // check if endRack (coded later) == targetRack
    const validTrips = tripsSnap.docs.filter((doc) => {
      const trip = doc.data();
      const tripEnd = trip.endTime?.toDate?.();
      if (!tripEnd) return false;

      const tripId = doc.id;
      if (alreadyClaimedTripIds.includes(tripId)) return false; // already used

      const hour = tripEnd.getHours();
      const day = tripEnd.toLocaleString("en-US", { weekday: "long" });

      console.log("[VERIFY]", hour, day, trip.endRack);
      console.log(
        "[VERIFY]",
        timeLowerReq,
        timeUpperReq,
        targetDay,
        targetRack
      );

      const timeValid = hour >= timeLowerReq && hour < timeUpperReq;
      const dayValid = day === targetDay;
      const rackValid = trip.endRack === targetRack;

      return timeValid && dayValid && rackValid;
    });

    const claimedTripIds = validTrips.map((doc) => doc.id);
    // no matching trips
    if (claimedTripIds.length === 0) {
      return res
        .status(403)
        .json({ error: "No eligible trips to claim reward" });
    }

    // update user log
    console.log("New credits:", userData.credits + prize);

    await userRef.update({
      rewards: admin.firestore.FieldValue.arrayUnion(rewardId),
      rewardTrips: admin.firestore.FieldValue.arrayUnion(...claimedTripIds),
      credits: userData.credits + prize,
    });

    res.status(200).json({ message: "Reward claimed" });
  } catch (err) {
    console.error("Error updating reward:", err);
    res.status(500).json({ error: "Failed to claim reward" });
  }
});

module.exports = router;
