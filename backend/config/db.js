const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      retryWrites: true,
      w: "majority",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log(
      "Ensure your IP is whitelisted in MongoDB Atlas Network Access"
    );
    // Don't exit the process, let it retry
    throw error;
  }
};

module.exports = connectDB;
