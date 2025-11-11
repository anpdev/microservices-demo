import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "order-service", brokers: [process.env.KAFKA_BROKER || "kafka:9092"] });
const producer = kafka.producer();
async function connectKafka() {
  try {
    await producer.connect();
    console.log("Connected to Kafka");
  } catch (err) {
    console.error("Kafka connection failed:", err);
  }
}

connectKafka();

export async function sendOrderEvent(order) {
  await producer.send({
    topic: "order-events",
    messages: [{ value: JSON.stringify(order) }],
  });
  console.log("✅ Order event sent to Kafka", order);
}
