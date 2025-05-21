const express = require("express");
const { admin, db } = require("../config/firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.post("/payTrip", async (req, res) => {
  const {tripId, minusBalance} = req.body;
  console.log(`[SERVER] Updating balance`);
  if (!tripId) return res.status(400).json({ error: "tripId missing" });

  try {
    // trip payment logic here
    // get trip data
    const tripRef = db.collection('trips').doc(tripId);
    const tripSnap = await tripRef.get();
    if (!tripSnap.exists) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const tripData = tripSnap.data();
    
    // get user data
    const userId = tripData?.userId;
    if (!userId) {
      return res.status(404).json({ error: 'Trip does not have a userId' });
    }
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data();
    const balance = userData.balance;

    console.log(tripId, minusBalance);

    // check if sufficient balance
    // error if not
    if (balance < minusBalance) {
      return res.status(404).json({
        error: 'Insufficient balance',
        balance,
      });
    }
    //return res.status(404).json({ error: "Failed to complete payment" });
    console.log("sufficient balance");
    // if enough, update balance values
    // update trip paid bool
    console.log(tripRef);
    tripRef.update({
      paid: true
    });

    userRef.update({
      balance: balance - minusBalance
    });
    
    return res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    return res.status(404).json({ error: "Failed to complete payment" });
  }
});

module.exports = router;
