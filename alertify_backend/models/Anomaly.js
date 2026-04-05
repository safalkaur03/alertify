const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },   // ✅ ADD
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // ✅ ADD
    type: { type: String, required: true },
    details: { type: Object },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anomaly', anomalySchema);