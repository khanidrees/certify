import mongoose, { Mongoose } from 'mongoose';
import { logger } from './logger';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// M0 Atlas free tier: conservative pool. Vercel serverless functions are short-lived,
// so a small pool avoids exhausting the ~500 connection limit across concurrent invocations.
const MONGOOSE_OPTIONS: Parameters<typeof mongoose.connect>[1] = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 30000,
};

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, MONGOOSE_OPTIONS)
      .then((m) => {
        logger.info('MongoDB connected', { uri: MONGODB_URI.split('@')[1] ?? 'hidden' });
        return m;
      })
      .catch((err) => {
        // Reset so the next request can retry instead of re-using a failed promise
        cached.promise = null;
        logger.error('MongoDB connection failed', { error: (err as Error).message });
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}