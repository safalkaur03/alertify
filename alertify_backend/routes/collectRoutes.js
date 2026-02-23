const express = require("express");
const Site = require("../models/site");
const Event = require("../models/Event");
const detectAnomaly = require("../utils/detectAnomaly");
const router = express.Router();

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

    // 2️⃣ Create event with actual fields only (safe for real tracker)
    const event = new Event({
      site: site._id,
      sessionId,
      eventType,
      url,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });

    await event.save();

    // 3️⃣ Temporary wrapper for anomaly testing (Postman only)
    const tempEventForAnomaly = {
      ...event.toObject(),        // existing saved fields
      clicks: clicks || 0,        // use Postman-provided test values
      scrollDepth: scrollDepth || 0,
      requestsPerMinute: requestsPerMinute || 0
    };

    // 4️⃣ Run anomaly detection
    const anomalies = await detectAnomaly(tempEventForAnomaly);

    // ✅ Respond once, safe
    res.status(201).json({ 
      message: "Event recorded",
      anomaliesDetected: anomalies.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;