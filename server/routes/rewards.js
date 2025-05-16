const express = require("express");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.post("/verify", async (req, res) => {
  const { userId, rewardId } = req.body;
  console.log("[SERVER] Verifying...");

  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      rewards: admin.firestore.FieldValue.arrayUnion(rewardId),
    });

    res.status(200).json({ message: "Reward claimed" });
  } catch (err) {
    console.error("Error updating reward:", err);
    res.status(500).json({ error: "Failed to claim reward" });
  }
});

module.exports = router;