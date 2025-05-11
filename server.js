const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimiter = require('./src/api/middlewares/rateLimiter');
const urlRoutes = require('./src/api/routes/urlRoutes');
const connectKafkaProducer = require('./src/services/kafkaProducer');
const redisClient = require('./src/services/cacheService');
const startAnalyticsConsumer = require('./src/consumers/analyticsConsumer');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

// Rate Limiter Middleware
app.use(rateLimiter);

// Routes
app.use('/api', urlRoutes);
const analyticsRoutes = require('./src/api/routes/analyticsRoutes');
app.use('/api', analyticsRoutes);

// Startup function
async function init() {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('✅ Redis connected');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/url_shortener', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Kafka producer (optional but good practice)
    await connectKafkaProducer();

    // Kafka consumer (analytics)
    await startAnalyticsConsumer();

    // Start Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1); // Exit if any critical service fails
  }
}

// Start everything
init();
