// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'analytics-service',
//   brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
// });

// const consumer = kafka.consumer({ groupId: 'analytics-group' });

// async function startAnalyticsConsumer(retries = 5, delay = 5000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       await consumer.connect();
//       await consumer.subscribe({ topic: 'url-analytics', fromBeginning: false });
//       await consumer.run({
//         eachMessage: async ({ message }) => {
//           const data = JSON.parse(message.value.toString());
//           console.log('📊 Received analytics:', data);
//         }
//       });
//       console.log('✅ Kafka consumer connected');
//       break;
//     } catch (err) {
//       console.error(`❌ Kafka connection failed. Retry ${i + 1}/${retries}`, err.message);
//       if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
//       else throw new Error('Failed to connect to Kafka after retries.');
//     }
//   }
// }

// module.exports = startAnalyticsConsumer;



// src/consumers/analyticsConsumer.js
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const UrlVisit = require('../db/models/urlVisitModel');  // Import the UrlVisit model

const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

async function startAnalyticsConsumer(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: 'url-analytics', fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const data = JSON.parse(message.value.toString());
          console.log('📊 Received analytics:', data);

          // Extract the shortUrl from the data
          const { shortUrl, timestamp, headers } = data;

          // Insert a new UrlVisit document for the current visit
          await UrlVisit.create({
            shortUrl,
            timestamp,
            headers,
          });

          // Update the totalVisits for the corresponding shortUrl
          const urlVisit = await UrlVisit.findOne({ shortUrl });

          if (urlVisit) {
            urlVisit.totalVisits += 1;
            await urlVisit.save();  // Save the updated totalVisits count
            console.log(`Total visits for ${shortUrl} updated to ${urlVisit.totalVisits}`);
          } else {
            // If no document exists for the shortUrl, create it with totalVisits as 1
            const newUrlVisit = new UrlVisit({
              shortUrl,
              timestamp,
              headers,
              totalVisits: 1,
            });
            await newUrlVisit.save();
            console.log(`New URL visit created for ${shortUrl} with 1 visit`);
          }
        }
      });

      console.log('✅ Kafka consumer connected');
      break;
    } catch (err) {
      console.error(`❌ Kafka connection failed. Retry ${i + 1}/${retries}`, err.message);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else throw new Error('Failed to connect to Kafka after retries.');
    }
  }
}

module.exports = startAnalyticsConsumer;


