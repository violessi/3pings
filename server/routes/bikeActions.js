const express = require("express");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.get("/getBike/:bikeId", async (req, res) => {
  try {
    const bikeId = req.params.bikeId;
    const bikeRef = db.collection("bikes").doc(bikeId);
    const bikeDoc = await bikeRef.get();

    if (!bikeDoc.exists) {
      res.status(200).json({ message: false });
    } else {
      res.status(200).json({ message: true }, bikeDoc.data());
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check bike" });
  }
});

module.exports = router;
