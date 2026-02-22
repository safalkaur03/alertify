const express = require("express");
const Site = require("../models/site");
const Event = require("../models/Event");

const router = express.Router();

// PUBLIC endpoint (no auth middleware)
router.post("/", async (req, res) => {
  try {
    const { trackingId, sessionId, eventType, url } = req.body;

    if (!trackingId || !sessionId || !eventType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Find site using trackingId
    const site = await Site.findOne({ trackingId });

    if (!site) {
      return res.status(404).json({ message: "Invalid tracking ID" });
    }

    // 2️⃣ Create event
    const event = new Event({
      site: site._id,
      sessionId,
      eventType,
      url,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await event.save();

    res.status(201).json({ message: "Event recorded" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;