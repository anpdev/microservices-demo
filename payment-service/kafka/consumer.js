import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "payment-service", brokers: [process.env.KAFKA_BROKER || "kafka:9092"] });
const consumer = kafka.consumer({ groupId: "payment-group" });

export async function listenOrderEvents() {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-events" });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log("💰 Processing payment for order:", order.id);
    },
  });
}
