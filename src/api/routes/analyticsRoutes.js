// // src/api/routes/analyticsRoutes.js
// const express = require('express');
// const router = express.Router();
// const Analytics = require('../../db/models/analyticsModel');

// router.get('/analytics/:shortUrl', async (req, res) => {
//   try {
//     const { shortUrl } = req.params;
//     const records = await Analytics.find({ shortUrl }).sort({ timestamp: -1 });

//     res.json({ shortUrl, totalVisits: records.length, visits: records });
//   } catch (err) {
//     console.error('Error fetching analytics:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;

// src/api/routes/analyticsRoutes.js


// const express = require('express');
// const router = express.Router();
// const UrlVisit = require('../../db/models/urlVisitModel'); // Corrected model name

// // Route to get analytics for a given short URL
// router.get('/analytics/:shortUrl', async (req, res) => {
//   try {
//     const { shortUrl } = req.params;

//     // Fetch the records for the given shortUrl and aggregate visits
//     const records = await UrlVisit.find({ shortUrl }).sort({ timestamp: -1 });

//     if (!records || records.length === 0) {
//       return res.status(404).json({ error: 'No visits found for this short URL.' });
//     }

//     // Aggregate the total visits from the records (optional for optimization if needed)
//     const totalVisits = records.length;

//     // Return the analytics data
//     res.json({ shortUrl, totalVisits, visits: records });
//   } catch (err) {
//     console.error('Error fetching analytics:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const UrlVisit = require('../../db/models/urlVisitModel'); // Import the model

// GET /api/analytics/:shortUrl - Fetch analytics for a given short URL
router.get('/analytics/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;

    // Find all visit documents for the shortUrl
    const visits = await UrlVisit.find({ shortUrl }).sort({ timestamp: -1 });

    if (!visits || visits.length === 0) {
      return res.status(404).json({ error: 'No visits found for this short URL.' });
    }

    const totalVisits = visits.length;

    // Return analytics
    res.json({
      shortUrl,
      totalVisits,
      visits,
    });

  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

