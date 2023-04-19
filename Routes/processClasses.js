const express = require("express");
const router = express.Router();
const {
  ProcessClass,
  ProcessClassPhase,
  RecipeEquipmentRequirement: RER,
} = require("../LocalDatabase/TPMDB");
const enviornment = "Local";

router.get("/", (req, res) => {
  console.time("Get all process classes");
  if (enviornment === "Local") {
    res.json(ProcessClass);
  }
  if (enviornment === "Production") {
    db.select("ID", "Name", "Description", "ProcessGroup_ID")
      .from("ProcessClass")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all process classes");
});

router.get("/required", (req, res) => {
  console.time("Get all process class requirements");
  if (enviornment === "Local") {
    res.json(RER);
  }
  if (enviornment === "Production") {
    db.select(
      "ID",
      "Recipe_RID",
      "Recipe_Version",
      "ProcessClass_Name",
      "Equipment_Name",
      "IsMainBatchUnit"
    )
      .from("RecipeEquipmentRequirement")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all process class requirements");
});
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
  if (enviornment === "Production") {
    db.select(
      "ID",
      "Recipe_RID",
      "Recipe_Version",
      "ProcessClass_Name",
      "Equipment_Name",
      "IsMainBatchUnit"
    )
      .from("RecipeEquipmentRequirement")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get single process class requirement");
});

router.get("/phases", (req, res) => {
  console.time("Get all process class phases");

  res.json(ProcessClassPhase);

  console.timeEnd("Get all process class phases");
});
router.get("/phases/:ID", (req, res) => {
  console.time("Get single process class phase");
  const selectedProcessClassPhase = ProcessClassPhase.filter(
    (row) => +row.ID === +req.params.ID
  );
  res.json(selectedProcessClassPhase);

  console.timeEnd("Get single process class phase");
});

module.exports = router;
