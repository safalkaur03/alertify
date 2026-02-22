const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Site = require("../models/site");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ✅ CREATE SITE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, domain } = req.body;

    if (!name || !domain) {
      return res.status(400).json({ message: "Name and domain required" });
    }

    const trackingId = "ALERTIFY_" + uuidv4();

    const site = new Site({
      name,
      domain,
      trackingId,
      admin: req.admin.id,   // ✅ FIXED
    });

    await site.save();

    res.status(201).json(site);

  } catch (error) {
    console.log(error);   // 🔥 add this for debugging
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET ALL SITES OF LOGGED-IN ADMIN
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sites = await Site.find({ admin: req.admin.id });
    res.json(sites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ DELETE SITE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({
      _id: req.params.id,
      admin: req.admin.id,   // ✅ FIXED
    });

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json({ message: "Site deleted" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;