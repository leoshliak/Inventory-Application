require('dotenv').config();
const { Pool } = require('pg');

const config = {
  connectionString: process.env.DATABASE_URL,
  // Railway requires SSL in production
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
    ssl: { rejectUnauthorized: false }
};

module.exports = new Pool(config);