const { requestBikeReturn } = require("../controllers/returnController");
const { completeBikeReturn } = require("../controllers/returnController");
const express = require("express");

const router = express.Router();
router.use(express.json());

router.post("/request", requestBikeReturn);
router.post("/complete", completeBikeReturn);

module.exports = router;
