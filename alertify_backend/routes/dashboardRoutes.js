const express = require("express");
const router = express.Router();
const Anomaly = require("../models/Anomaly");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// GET all anomalies for logged-in admin
router.get("/anomalies", auth, async (req, res) => {
  try {
    const anomalies = await Anomaly.find({ adminId: new mongoose.Types.ObjectId(req.admin.id) })
      .populate("eventId")
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(anomalies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;