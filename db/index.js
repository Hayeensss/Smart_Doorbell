const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");
const dotenv = require("dotenv");
const schema = require("./schema");

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const client = new Client({
  connectionString: connectionString,
  host: new URL(connectionString).hostname,
  family: 4,
});

client.connect((err) => {
  if (err) {
    console.error("Explicit connection error:", err.stack);
  }
});

const db = drizzle(client, { schema });

module.exports = { db, client };
