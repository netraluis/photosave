import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI env is not defined");
  }
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    return client;
  } catch (error: any) {
    throw new Error("Error with the database client");
  }
};
