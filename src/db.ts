import { MongoClient, Db } from "mongodb";

const db_credentials = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  host: process.env.DB_HOST,
};

const uri: string = `mongodb://${db_credentials.user}:${db_credentials.pass}@${db_credentials.host}/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=silvernote&appName=mongosh+2.5.8`;
const client = new MongoClient(uri);

let db: Db;

async function connectDB() {
  await client.connect();
  db = client.db("silvernote");
  console.log("Connected to MongoDB");
}

function getDB() {
  if (!db) throw new Error("Mongodb as not connected !");
  return db;
}


export { connectDB, getDB };
