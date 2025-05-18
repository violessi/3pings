const express = require("express");
const { admin, db } = require("../config/firebaseAdmin");

const router = express.Router();
router.use(express.json());
