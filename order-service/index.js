import express from "express";
import { sendOrderEvent } from "./kafka/producer.js";

const app = express();
app.use(express.json());

app.post("/orders", async (req, res) => {
  const order = { id: Date.now(), userId: req.body.userId, amount: 100 };
  await sendOrderEvent(order);
  res.json({ message: "Order placed", order });
});

app.listen(3002, () => console.log("Order Service running on 3002"));
