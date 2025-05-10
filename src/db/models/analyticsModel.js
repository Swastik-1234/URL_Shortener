// src/db/models/AnalyticsModel.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  shortUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  headers: { type: Object }, // Optional: to store user-agent, IP, etc.
});

module.exports = mongoose.model('Analytics', analyticsSchema);
