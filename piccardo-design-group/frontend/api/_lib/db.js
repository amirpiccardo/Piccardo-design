const mongoose = require("mongoose");

// Riusa la connessione tra invocazioni della stessa funzione serverless
// (evita di aprire una connessione Mongo nuova ad ogni richiesta).
let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
