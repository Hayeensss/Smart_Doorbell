const dotenv = require("dotenv");
const { defineConfig } = require("drizzle-kit");

dotenv.config({ path: ".env" }); // Load environment variables from .env

module.exports = defineConfig({
  schema: "./db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
