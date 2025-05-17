const express = require("express");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.post("/payTrip", async (req, res) => {
  const { tripId } = req.body;
  console.log(`[SERVER] Updating balance`);

  try {
    // trip payment logic here

    res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ error: "Failed to complete payment" });
  }
});

module.exports = router;