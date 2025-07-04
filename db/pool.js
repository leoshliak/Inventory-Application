require('dotenv').config();
const { Pool } = require('pg');

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL || // Use this if available
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false,
      // Add these for better compatibility
      require: true,
      ca: process.env.DB_CA_CERT // Only if Railway provides one
    }
  },
  // Add connection timeouts
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});
