import express from "express";
import { listenOrderEvents } from "./kafka/consumer.js";

const app = express();
app.use(express.json());

app.get("/payments", (req, res) => res.send("Payment Service Ready Hello ma "));
listenOrderEvents();

app.listen(3003, () => console.log("Payment Service running on 3003"));
