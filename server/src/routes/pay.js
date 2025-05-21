const express = require("express");
const { admin, db } = require("../config/firebaseAdmin");

const router = express.Router();
router.use(express.json());

router.post("/payTrip", async (req, res) => {
  const { tripId, minusBalance, minusCredits } = req.body;
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
      return res.status(400).json({ error: 'Trip does not have a userId' });
    }
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    console.log(tripId, minusBalance, );

    // check if sufficient balance
    // error if not
    if (balance < minusBalance) {
      return res.status(400).json({
        error: 'Insufficient balance',
        balance,
      });
    }

    // if enough, update balance values
    // update trip paid bool
    // batch to do multiple updates
    const batch = db.batch();

    batch.update(tripRef, {
      paid: true,
    });

    batch.update(userRef, {
      balance: currentBalance - minusBalance,
    });

    await batch.commit();

    res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ error: "Failed to complete payment" });
  }
});

module.exports = router;
