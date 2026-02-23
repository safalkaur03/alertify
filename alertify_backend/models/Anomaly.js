const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    type: { type: String, required: true },          // e.g., "High traffic", "Excessive clicks"
    details: { type: Object },                        // optional: store numbers, IP, sessionId
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anomaly', anomalySchema);