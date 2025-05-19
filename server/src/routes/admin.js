const express = require("express");
const { admin, db } = require("../config/firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.post("/getIP", async (req, res) => {
  const { rackId, rackIPAdd } = req.body;
  console.log(`[SERVER] Received get IP req`);

  try {
    const rackRef = db.collection("racks").doc(rackId);
    await rackRef.update({
      rackIP: rackIPAdd,
    });

    res.status(200).json({ message: "Rack ID received" });
  } catch (err) {
    res.status(500).json({ error: "Failed to receive rack ID" });
  }
});

module.exports = router;