import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    mongoose.connection.on('connected', () => {
      console.log('Database Connected')
    })
    
    console.log("✅ เชื่อมต่อสำเร็จ");
  } catch (err) {
    console.log("✖️ เชื่อมต่อไม่ได้:", err.message);
  }
}