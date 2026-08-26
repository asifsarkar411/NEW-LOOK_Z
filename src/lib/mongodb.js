import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://smferdousahmmed19_db_user:Z8xB6EbTFuFsr1KU@cluster0.cyxxsxo.mongodb.net/newlook_z?retryWrites=true&w=majority&appName=Cluster0';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Atlas Connection Error:', e.message);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
