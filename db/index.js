const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");
const dotenv = require("dotenv");
const schema = require("./schema");

dotenv.config({ path: ".env" }); // Load environment variables

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

// Create the PostgreSQL client
const client = new Client({
  connectionString: connectionString,
});

client
  .connect()
  .then(() => console.log("Connected to Supabase PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

// Create the Drizzle instance
const db = drizzle(client, { schema });

// Export the Drizzle instance and potentially the client
module.exports = { db, client };
