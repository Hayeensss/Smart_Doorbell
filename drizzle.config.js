const dotenv = require("dotenv");
const { defineConfig } = require("drizzle-kit");

dotenv.config({ path: ".env" }); // Load environment variables from .env

module.exports = defineConfig({
  schema: "./db/schema.js", // Path to your schema file
  out: "./drizzle", // Directory to output migrations
  dialect: "postgresql", // Specify the database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL, // Get the connection URL from environment variables (removed !)
  },
  verbose: true, // Optional: Enable verbose logging
  strict: true, // Optional: Enable strict mode for schema checks
});
