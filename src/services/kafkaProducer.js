const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'kafka:9092'] });
const producer = kafka.producer();

async function connectKafkaProducer() {
  await producer.connect();
  console.log('Kafka Producer connected');
}

async function sendToKafka(topic, message) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Sent message to ${topic}`);
  } catch (err) {
    console.error('Kafka send error:', err);
  }
}

module.exports = connectKafkaProducer;
module.exports.sendToKafka = sendToKafka;

