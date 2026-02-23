const Anomaly = require('../models/Anomaly');

async function detectAnomaly(event) {
    console.log("Event received for anomaly detection:", event);
    const anomalies = [];

    // Example thresholds
    if(event.requestsPerMinute > 100) {
        anomalies.push({
            type: 'High traffic',
            details: { requests: event.requestsPerMinute }
        });
    }

    if(event.clicks > 50) {
        anomalies.push({
            type: 'Excessive clicks',
            details: { clicks: event.clicks }
        });
    }

    if(event.scrollDepth > 80) {
        anomalies.push({
            type: 'Deep scrolling',
            details: { scrollDepth: event.scrollDepth }
        });
    }

    // Save all detected anomalies to DB
    for(const anomaly of anomalies) {
        await Anomaly.create({
            eventId: event._id,
            type: anomaly.type,
            details: anomaly.details
        });
    }

    return anomalies; // optional: for logging or immediate response
}

module.exports = detectAnomaly;