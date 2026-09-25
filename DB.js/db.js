const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Silakan definisikan variabel MONGODB_URI di Vercel Settings!");
}

// Menyimpan koneksi di memori global Vercel agar bisa dipakai ulang
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToMongoDB = async () => {
  // Jika koneksi sudah ada, langsung gunakan kembali yang ada
  if (cached.conn) {
    return cached.conn;
  }

  // Jika belum ada koneksi, buat koneksi baru
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Wajib di Vercel agar tidak memicu timeout
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("Connected to MongoDB via cache");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset jika gagal agar bisa dicoba kembali nanti
    console.error("MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
};

module.exports = connectToMongoDB;
  
