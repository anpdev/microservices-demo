import express from 'express';
import env from 'dotenv';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from "cors";



const app = express();
app.use(express.json());
app.use(cookieParser());

// For dev: allow requests from React dev server
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true // VERY IMPORTANT: allow cookies cross-origin
}));

env.config();
const PORT = process.env.PORT || 4000

app.use(morgan('tiny'));
app.listen(PORT,()=> console.log(`Auth service working on ${PORT}`));
export default app;