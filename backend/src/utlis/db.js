import pg from "pg";
import { ENV } from "../config/env.js";

// Determine if we are running in production
const isProduction = process.env.NODE_ENV === "production";

const pool = new pg.Pool({
  // Use the single connection string provided by Render
  connectionString: ENV.DATABASE_URL,
  // Render Postgres requires SSL connections from external apps.
  // If your DB is also on Render and in the same region, you might not need this, 
  // but it's safest to include for cloud deployments.
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Test the connection pool on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client from database pool", err.stack);
  } else {
    console.log("Database connected successfully");
    release();
  }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
  process.exit(-1);
});

// Export a robust query method
export const query = (text, params) => pool.query(text, params);