// // src/models/urlVisitModel.js
// const mongoose = require('mongoose');

// const UrlVisitSchema = new mongoose.Schema({
//   shortUrl: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     required: true,
//   },
//   headers: {
//     type: Object,
//     required: false,
//   },
// });

// module.exports = mongoose.model('UrlVisit', UrlVisitSchema);

// src/models/urlVisitModel.js
const mongoose = require('mongoose');

const UrlVisitSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  headers: {
    type: Object,
    required: false,
  },
  totalVisits: {
    type: Number,
    default: 0,  // Default value for total visits
  },
});

module.exports = mongoose.model('UrlVisit', UrlVisitSchema);

