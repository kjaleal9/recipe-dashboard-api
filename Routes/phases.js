const express = require("express");
const sql = require("mssql");
const router = express.Router();
const { Phase } = require("../LocalDatabase/TPMDB");
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
  res.json(Phase);
});

router.get("/:ID", (req, res) => {
  console.log(req.params.ID);
  res.json(Phase.find((phase) => phase.ID === +req.params.ID));
});

router.get("/phase-types/:ID", (req, res) => {
  console.time("Get phase types by process class ID");
  if (enviornment === "Production") {
    pool
      .connect()
      .then(() => {
        console.time("Connection closed");
        return pool.request().query(`
        SELECT 
            ProcessClassPhase.ID, 
            ProcessClassPhase.Name, 
            ProcessClassPhase.PhaseType_ID, 
            PhaseType.PhaseCategory_ID 
        FROM PhaseType 
            INNER JOIN ProcessClassPhase ON PhaseType.ID = ProcessClassPhase.PhaseType_ID 
        WHERE TypeBatchKernel = 1 and ProcessClass_Id = '${req.params.ID}'
        ORDER BY Name
      `);
      })
      .then((result) => {
        res.json(result.recordsets[0]);
      })
      .catch((err) => {
        console.error("Query error:", err);
      })
      .finally(() => {
        pool.close();
        console.timeEnd("Connection closed");
        console.timeEnd("Get phase types by process class ID");
      });
  }
});

module.exports = router;
