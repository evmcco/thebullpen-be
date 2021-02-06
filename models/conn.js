// database connection parameters

const pgp = require("pg-promise")({
  query: e => {
    console.log("QUERY:", e.query);
  }
});

const options = {
  host: "localhost",
  database: "thebullpen"
};

const db = pgp(options);

module.exports = db;