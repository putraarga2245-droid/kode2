const express = require("express");
const connectToMongoDB = require("../db/db"); // Mengarah ke folder 'db' huruf kecil

const app = express();
app.use(express.json());

// PENTING: Middleware untuk cek/sambung MongoDB di setiap request masuk
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    res.status(500).json({ 
      error: "Database Connection Failed", 
      details: error.message 
    });
  }
});

// Route pengetesan API Anda
app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "API is working perfectly with MongoDB" });
});

module.exports = (req, res) => {
  app(req, res);
};
      
