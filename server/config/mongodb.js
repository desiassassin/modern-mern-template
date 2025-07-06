import mongoose from "mongoose";

export async function connect() {
     try {
          await mongoose.connect(process.env.MONGODB_URL, { autoCreate: true });
          console.log("Connected to MongoDB Atlas Cloud Database");
     } catch (error) {
          console.error("MongoDB connection error:", error);
          throw error;
     }
}
