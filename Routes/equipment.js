const express = require("express");
const sql = require("mssql");
const router = express.Router();
const { Equipment } = require("../LocalDatabase/TPMDB");
const enviornment = "Production";

const config = {
  user: "TPMDB",
  password: "TPMDB",
  server: "localhost", // You can use 'localhost\\instance' to connect to named instance
  database: "TPMDB",
  stream: false,
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

router.get("/", (req, res) => {
  console.time("Get all equipment");
  res.json(Equipment);
  console.timeEnd("Get all equipment");
});

module.exports = router;
