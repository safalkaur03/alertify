const express = require("express");
const Site = require("../models/site");
const Event = require("../models/Event");
const router = express.Router();
const detectAnomaly = require("../utils/detectAnomaly");

// PUBLIC endpoint (no auth middleware)
router.post("/", async (req, res) => {
  try {
    const {
      trackingId,
      sessionId,
      eventType,
      url,
      clicks,
      scrollDepth,
      requestsPerMinute,
    } = req.body;

    // 3️⃣ Normalize inputs (IMPORTANT)
    const safeClicks = Number(clicks) || 0;
    const safeScroll = Number(scrollDepth) || 0;
    const safeRPM = Number(requestsPerMinute) || 0;

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
  userAgent: req.headers["user-agent"],
  clicks: safeClicks,
  scrollDepth: safeScroll,
  requestsPerMinute: safeRPM,
});

    await event.save();
await detectAnomaly({
  ...event.toObject(),
  siteId: site._id,
  adminId: site.admin,
  clicks: safeClicks,
  scrollDepth: safeScroll,
  requestsPerMinute: safeRPM
});
    


    // 5️⃣ Generate explanation (CONSISTENT)
    let explanation = "";

    if (safeClicks > 100) explanation += "High clicks, ";
    if (safeScroll > 80) explanation += "Deep scrolling, ";
    if (safeRPM > 100) explanation += "High request rate, ";

    if (!explanation) explanation = "Normal behavior";


    // 7️⃣ Final response
    res.status(201).json({
      message: "Event recorded",
      explanation,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;