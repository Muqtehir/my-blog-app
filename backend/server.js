require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cors = require("cors");

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => res.send("API is running..."));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
