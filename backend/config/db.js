const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Mongoose v6+ sets sensible defaults and the MongoDB driver options
    // useNewUrlParser and useUnifiedTopology are deprecated at the driver level.
    // Pass only the connection string; additional options can be added here if needed.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
