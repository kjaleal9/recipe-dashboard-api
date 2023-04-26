const express = require("express");
const sql = require("mssql");
const router = express.Router();
const { Material, MaterialClass } = require("../LocalDatabase/TPMDB");
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
  console.time("Get all materials");
  if (enviornment === "Production") {
    res.json(Material);
  }
  
  console.timeEnd("Get all materials");
});

router.get("/classes", (req, res) => {
  console.time("Get all material classes");
  if (enviornment === "Production") {
    res.json(MaterialClass);
  }
  
  console.timeEnd("Get all material classes");
});

module.exports = router;
