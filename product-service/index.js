import express from 'express';
import connectDB from './config/db.js';
import mongoose from "mongoose";
import cors from "cors";
import { ObjectId } from "mongodb";

const app = express();
await connectDB();
await mongoose.connection.asPromise();
const db = mongoose.connection.db;
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true // VERY IMPORTANT: allow cookies cross-origin
}));

app.get('/api/products', async( req, res, next)=> {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

  const products =  await db.collection('movies').find({}, { title: 1, plot: 1,poster:1, year:1, _id: 0 })
  .skip(skip)
  .limit(limit)
  .toArray();

   // 3️⃣ Count total documents (for frontend total page calculation)
    const totalRecords = await db.collection("movies").countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);
 res.status(200).json({
      success: true,
      page,
      limit,
      totalPages,
      totalRecords,
      products,
    }); 
    } catch (error) {
    console.error("❌ Error fetching paginated products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

 
app.listen(4005, ()=>{ console.log('Product service is running on 4005')  })