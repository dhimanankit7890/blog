import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 10000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Always create a fresh client in development to avoid stale cached connections
  if (!global._mongoClientPromise || !global._mongoUri || global._mongoUri !== uri) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    global._mongoUri = uri;
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
