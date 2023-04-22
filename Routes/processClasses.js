const express = require("express");
const router = express.Router();
const {
  ProcessClass,
  ProcessClassPhase,
  RecipeEquipmentRequirement: RER,
} = require("../LocalDatabase/TPMDB");
const enviornment = "Local";

// GET full database of process classes
router.get("/", (req, res) => {
  console.time("Get all process classes");

  if (enviornment === "Local") {
    res.json(ProcessClass);
  }
  
  console.timeEnd("Get all process classes");
});

// GET full database of process class requirements
router.get("/required", (req, res) => {
  console.time("Get all process class requirements");

  if (enviornment === "Local") {
    res.json(RER);
  }

  console.timeEnd("Get all process class requirements");
});

// GET the required process classes for one recipe.
// Must provide RID and version
router.get("/required/:RID/:ver", (req, res) => {
  console.time("Get single process class requirement");

  if (enviornment === "Local") {
    const selectedRER = RER.filter(
      (row) =>
        row.Recipe_RID === req.params.RID &&
        +row.Recipe_Version === +req.params.ver
    );

    res.json(selectedRER);
  }

  console.timeEnd("Get single process class requirement");
});

// GET full database of process class phases
router.get("/phases", (req, res) => {
  console.time("Get all process class phases");

  res.json(ProcessClassPhase);

  console.timeEnd("Get all process class phases");
});

// GET process class phase by ID.
// ID is provided by ProcessClassPhase_ID in TPIBK_RecipeBatchData
router.get("/phases/:ID", (req, res) => {
  console.time("Get single process class phase by ID");

  const selectedProcessClassPhase = ProcessClassPhase.filter((row) => {
    return +row.ID === +req.params.ID;
  });

  res.json(selectedProcessClassPhase);

  console.timeEnd("Get single process class phase by ID");
});

module.exports = router;
