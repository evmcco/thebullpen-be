// database connection parameters
require('dotenv').config()

const pgp = require("pg-promise")

const options = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
} : {
  host: "localhost",
  database: "thebullpen",
};

const db = pgp(options);

module.exports = db;