const express = require("express");
const { admin, db } = require("../config/firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.post("/getIP", async (req, res) => {
  const { IPAddr } = req.body;
  console.log(`[SERVER] Received get IP req`);

  try {
    const rackRef = db.collection("racks").doc("rack123");
    await rackRef.update({
      rackIP: IPAddr,
    });

    res.status(200).json({ message: "Rack ID received" });
  } catch (err) {
    res.status(500).json({ error: "Failed to receive rack ID" });
  }
});

router.post("/reset", async (req, res) => {
  try {
    // set all bikes to available; allow space for rent-return-reserve
    const bikesSnapshot = await db.collection("bikes").get();
    const bikeBatch = db.batch();
    bikesSnapshot.forEach((doc) => {
      bikeBatch.update(doc.ref, { status: "available" });
    });
    await bikeBatch.commit();

    // clear/delete trips not demotrips
    // CONSIDER: clear/delete completed trips EXCEPT trips named demotripX
    // so we have hardcoded trips na for showing ui/cerifying rewards
    // everything else is for user testing
    const tripsSnapshot = await db.collection("trips").get();
    const tripBatch = db.batch();
    tripsSnapshot.forEach((doc) => {
      const data = doc.data();
      const isDemoTrip = doc.id.includes("demotrip");
      const shouldDelete =
        (data.status === "active" || data.status === "completed") &&
        !isDemoTrip;

      if (shouldDelete) {
        tripBatch.delete(doc.ref);
      }
    });
    await tripBatch.commit();

    // clear user.currentTrip
    // remove user rewards and rewardTrips EXCEPT demotrip1 and reward 1
    // so we can show what it looks like when they have a verified reward vs claiming a new one
    const usersSnapshot = await db.collection("users").get();
    const userBatch = db.batch();
    usersSnapshot.forEach((doc) => {
      userBatch.update(doc.ref, { currentTrip: "" });
      userBatch.update(doc.ref, { rewards: ["reward1"] });
      userBatch.update(doc.ref, { rewardTrips: ["demotrip1"] });
    });
    await userBatch.commit();

    // reset credits to 5
    // const usersSnapshot3 = await db.collection("users").get();
    // const batch2 = db.batch();
    // usersSnapshot3.forEach((doc) => {
    //   batch2.update(doc.ref, { credits: 5 });
    // });
    // await batch2.commit();

    res.status(200).json({ message: "Database reset, ready for demo" });
  } catch (err) {
    console.error("Error resetting:", err);
    res.status(500).json({ error: "Failed to reset" });
  }
});

router.post("/unpay3", async (req, res) => {
  const demotrip3Ref = db.collection("trips").doc("demotrip3");
  demotrip3Ref.update({ paid: false });
  res.status(200).json({ message: "demotrip3 unpaid" });
});

router.post("/log", (req, res) => {
  const text = req.body;
  console.log(`[SERVER] LOG FROM HW: ${text}`);
  res.status(200).json({ message: "Log received" });
});

module.exports = router;
