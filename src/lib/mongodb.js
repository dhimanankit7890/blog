import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

let clientPromise;

if (!uri) {
  // Return a rejected promise so API routes catch it in try/catch
  clientPromise = Promise.reject(
    new Error('Missing environment variable: "MONGODB_URI". Please add it in Netlify Site Settings > Environment Variables.')
  );
} else if (process.env.NODE_ENV === "development") {
  // In development, reuse the connection across hot reloads
  if (!global._mongoClientPromise || global._mongoUri !== uri) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    global._mongoUri = uri;
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (Netlify), create a new client per cold start
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
