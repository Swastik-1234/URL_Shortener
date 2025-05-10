// src/middleware/rateLimiter.js
const redisClient = require('../../services/cacheService');

const RATE_LIMIT = 100; // max requests per 15 minutes
const WINDOW_SIZE_IN_SECONDS = 15 * 60;

async function rateLimiter(req, res, next) {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;

  const requests = await redisClient.get(key);

  if (requests && parseInt(requests) >= RATE_LIMIT) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  if (!requests) {
    await redisClient.setEx(key, WINDOW_SIZE_IN_SECONDS, 1);
  } else {
    await redisClient.incr(key);
  }

  next();
}

module.exports = rateLimiter;