import express from "express";
import proxy from "express-http-proxy";

const app = express();

app.use("/api/users", proxy("http://localhost:3001"));
app.use("/orders", proxy("http://localhost:3002"));
app.use("/payments", proxy("http://localhost:3003"));

app.listen(3000, () => console.log("API Gateway running on 3000"));
