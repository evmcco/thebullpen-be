// database connection parameters
require('dotenv').config()

const pgp = require("pg-promise")({
  query: e => {
    console.log("QUERY:", e.query);
  }
});

const options = process.env.DATABASE_URL || {
  host: "localhost",
  database: "thebullpen"
};

const db = pgp(options);

module.exports = db;