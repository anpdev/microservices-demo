import mongoose from "mongoose";
  
const connectDB = async () => {
  try {
    //const uri = "mongodb+srv://anoop_1:anoop_12345@cluster0.wbzeu.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0";
    const uri = "mongodb://host.docker.internal:27017/sample_mflix"
       const client = await mongoose.connect(uri);
     mongoose.set("debug", true);
     console.log(`✅ MongoDB Connected to DB: ${client.connection.name} at host: ${client.connection.host}`);
     return client;
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
export default connectDB;
