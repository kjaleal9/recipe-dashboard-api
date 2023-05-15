const express = require("express");
const sql = require("mssql");
const router = express.Router();

const { Material, MaterialClass } = require("../LocalDatabase/TPMDB");

const enviornment = "Production";

router.get("/", async (req, res) => {
  console.time("Get all materials");

  if (enviornment === "Production") {
    try {
      const request = new sql.Request(req.app.locals.db);

      const result = await request.query(` 
        SELECT *
        FROM Material`);

      res.json(result.recordsets[0]);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
    console.timeEnd("Get all materials");
  }
});

router.get("/classes", async (req, res) => {
  console.time("Get all material classes");
  if (enviornment === "Production") {
    try {
      const request = new sql.Request(req.app.locals.db);

      const result = await request.query(` 
        SELECT *
        FROM MaterialClass`);

      res.json(result.recordsets[0]);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
    console.timeEnd("Get all material classes");
  }
});

module.exports = router;
