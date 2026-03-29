const express = require("express");
const Site = require("../models/site");
const Event = require("../models/Event");
const router = express.Router();
const axios = require("axios");
const Anomaly = require("../models/Anomaly");

// PUBLIC endpoint (no auth middleware)
router.post("/", async (req, res) => {
  try {
    const { trackingId, sessionId, eventType, url, clicks, scrollDepth, requestsPerMinute } = req.body;

    if (!trackingId || !sessionId || !eventType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Find site using trackingId
    const site = await Site.findOne({ trackingId });
    if (!site) {
      return res.status(404).json({ message: "Invalid tracking ID" });
    }

    // 2️⃣ Save event
    const event = new Event({
      site: site._id,
      sessionId,
      eventType,
      url,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });

    await event.save();

    // 3️⃣ Send data to Python ML service
    const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
      clicks: clicks || 0,
      scroll: scrollDepth || 0,
      rpm: requestsPerMinute || 0
    });

    const { result, score } = mlResponse.data;

    // 4️⃣ Save anomaly if detected
    if (result === "anomaly") {
      await Anomaly.create({
        eventId: event._id,
        type: "ML Detected Anomaly",
        details: { score }
      });
    }

    // 5️⃣ Final response
    res.status(201).json({ 
      message: "Event recorded",
      result,
      score
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;