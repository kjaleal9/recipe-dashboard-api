const express = require("express");
const router = express.Router();
const {
  ProcessClass,
  RecipeEquipmentRequirement,
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
    res.json(RecipeEquipmentRequirement);
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

module.exports = router;
