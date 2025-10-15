import { MongoClient, Db } from "mongodb";

const db_credentials = {
  uesr: process.env.DB_USER,
  pass: process.env.DB_PASS,
  host: process.env.DB_HOST,
};

const uri: string = `mongodb+srv://${db_credentials.uesr}:${db_credentials.pass}@${db_credentials.host}`;
const client = new MongoClient(uri);

let db: Db;

async function connectDB() {
  await client.connect();
  db = client.db("silvernote");
  console.log("✅ Connecté à MongoDB");
}

function getDB() {
  if (!db) throw new Error("❌ La base n’est pas connectée !");
  return db;
}


export { connectDB, getDB };
