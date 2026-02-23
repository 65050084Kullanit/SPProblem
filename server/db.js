// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

// module.exports = pool;

const { Pool } = require("pg");

const db = new Pool({
  user: "postgres",
  host: "223.205.68.231",
  database: "postgres",
  password: "Btisadmin",
  port: 5432
});

module.exports = db;
