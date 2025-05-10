const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://redis:6379'  // Use service name from docker-compose
});

redisClient.on('error', (err) => console.error('Redis error:', err));

module.exports = redisClient;
