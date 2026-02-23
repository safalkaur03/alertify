const express = require("express");
const router = express.Router();
const Anomaly = require("../models/Anomaly");
const Site = require("../models/site");
const auth = require("../middleware/auth");

// GET /api/anomalies
// Fetch all anomalies for sites owned by the logged-in admin
router.get("/", auth, async (req, res) => {
  try {
    // 1️⃣ Find all sites of this admin
    const sites = await Site.find({ admin: req.admin.id }).select("_id name");

    const siteIds = sites.map(site => site._id);

    // 2️⃣ Find anomalies for those sites
    const anomalies = await Anomaly.find({ "eventId.site": { $in: siteIds } })
      .populate({
        path: "eventId",
        select: "sessionId eventType url ip userAgent site"
      })
      .sort({ timestamp: -1 }); // latest first

    res.json({ success: true, anomalies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;