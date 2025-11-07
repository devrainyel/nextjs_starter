import mongoose from 'mongoose';

/**
 * MongoDB connection string sourced from the environment.
 * Throws immediately if the variable is missing so the app fails fast.
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing environment variable: MONGODB_URI');
}

type MongoConnection = typeof mongoose;

interface MongooseCache {
  conn: MongoConnection | null;
  promise: Promise<MongoConnection> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const connectionOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
} satisfies mongoose.ConnectOptions;

/**
 * Establishes (or reuses) a cached MongoDB connection via Mongoose.
 * Ensures a single connection instance during development hot reloads.
 */
export const connectToDatabase = async (): Promise<MongoConnection> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToDatabase;

