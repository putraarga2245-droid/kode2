const express = require("express");
// Menyesuaikan dengan folder kapital Anda agar server Linux Vercel tidak eror 500
const connectToMongoDB = require("../DB.js/db"); 

const app = express();
app.use(express.json());

// Middleware untuk memastikan koneksi database terjalin di setiap request masuk
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

// Route pengetesan API
app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "API is working perfectly with MongoDB" });
});

module.exports = (req, res) => {
  app(req, res);
};
  
