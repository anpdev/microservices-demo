import express from "express";
// import { verifyToken } from '../jwt-auth-service/service/jwtService.js'
import cors from 'cors';
// import redisClient from '../jwt-auth-service/config/redis.js';
import connectDB from './config/db.js';
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
 
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true // VERY IMPORTANT: allow cookies cross-origin
}));
await connectDB();
await mongoose.connection.asPromise();
 
const db = mongoose.connection.db;
 
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if ( !token ) return res.status(401).send('Token required');

  const decoded = verifyToken(token);
  if ( !decoded ) return res.status(401).send('Invalid token');

  req.user = decoded;
  next();
};

app.get("/", (req, res) => {
  res.send('<h1>Testing user service CI //// CD with docker hub </h1>');
});


app.get("/users", async (req, res) => {   
  // const cacheKey = 'users:all';
  // const cachedData = await redisClient.get(cacheKey); 
  // if(cachedData) {
  //   return res.json([{source:'cache'},{data : JSON.parse(cachedData) }]); 
  // }
  const users = await db.collection("users").find({}).toArray();
  //await redisClient.setEx(cacheKey, 60, JSON.stringify(users));
  return res.json([{source:'db'},{data : users }]); 
 
});

app.delete("/users/:id", async (req, res) => {   
 try {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Delete user from MongoDB
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Invalidate related Redis caches
    // const cacheKey = "users:all";
    // const cachedData = await redisClient.get(cacheKey);

    // if (cachedData) {
    //   let users = JSON.parse(cachedData);

    //   // Remove deleted user from cached list
    //   users = users.filter((u) => u._id !== userId && u._id !== String(userId));

    //   // Update cache with new user list
    //   await redisClient.setEx(cacheKey, 60, JSON.stringify(users));

    //   return res.json({
    //     message: "User deleted successfully (cache updated)",
    //     source: "cache-updated",
    //     deletedId: userId,
    //   });
    // }

    // Step 3: If no cache exists, just return success
    return res.json({
      message: "User deleted successfully (no cache found)",
      deletedId: userId,
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
 
});

app.listen(4001, () => console.log("User Service running on 4001"));
