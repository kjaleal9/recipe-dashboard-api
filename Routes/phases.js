const express = require("express");
const sql = require("mssql");
const router = express.Router();
const { Phase } = require("../LocalDatabase/TPMDB");
const enviornment = "Production";

router.get("/", (req, res) => {
  res.json(Phase);
});

router.get("/:ID", (req, res) => {
  console.log(req.params.ID);
  res.json(Phase.find((phase) => phase.ID === +req.params.ID));
});

router.get("/phase-types/:ID", async (req, res) => {
  console.time("Get phase types by process class ID");
  if (enviornment === "Production") {
    try {
      const request = new sql.Request(req.app.locals.db);

      const result = await request.query(`  
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

      res.json(result.recordsets[0]);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }

    console.timeEnd("Get phase types by process class ID");
  }
});

module.exports = router;
