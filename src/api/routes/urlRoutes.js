
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../../db/models/UrlModel');
const redisClient = require('../../services/cacheService');
const { sendToKafka } = require('../../services/kafkaProducer');
const { URL_VISITS_TOPIC } = require('../../kafka/topics');

// Store Short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl, userId } = req.body;

  // Ensure the original URL is a string
  if (typeof originalUrl !== 'string') {
    return res.status(400).json({ error: 'Original URL must be a string' });
  }

  const shortUrl = nanoid(6);
  const url = new Url({ originalUrl, shortUrl, userId });

  try {
    await url.save();
    console.log('shortUrl type:', typeof shortUrl);
    console.log('originalUrl type:', typeof originalUrl);

    // Set the short URL in Redis with an expiration time of 1 hour (3600 seconds)
    redisClient.set(shortUrl, originalUrl, 'EX', 3600);

    res.json({ shortUrl });
  } catch (err) {
    console.error('Error saving to MongoDB or Redis:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Visit Short URL
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  let originalUrl = await redisClient.get(shortUrl);
  if (!originalUrl) {
    const urlDoc = await Url.findOne({ shortUrl });
    if (!urlDoc) return res.status(404).json({ message: 'Not found' });
    originalUrl = urlDoc.originalUrl;
    await redisClient.set(shortUrl, originalUrl, 'EX', 3600); // Set expiry in Redis
  }

  // Send the visit data to Kafka (with shortUrl, timestamp, and headers)
  try {
    await sendToKafka(URL_VISITS_TOPIC, {
      shortUrl,
      timestamp: Date.now(),
      headers: req.headers,
    });
  } catch (kafkaErr) {
    console.error('Kafka send error:', kafkaErr.message);
    // Do NOT return here — let the request continue
  }

  // Redirect to the original URL
  res.redirect(originalUrl);
});

module.exports = router;

