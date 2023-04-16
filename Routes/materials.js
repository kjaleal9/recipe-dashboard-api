const express = require("express");
const router = express.Router();
const { Material, MaterialClass } = require("../LocalDatabase/TPMDB");
const enviornment = "Local";

router.get("/", (req, res) => {
  console.time("Get all materials");
  if (enviornment === "Local") {
    res.json(Material);
  }
  if (enviornment === "Production") {
    db.select("ID", "SiteMaterialAlias", "Name", "MaterialClass_ID")
      .from("Material")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all materials");
});

router.get("/classes", (req, res) => {
  console.time("Get all material classes");
  if (enviornment === "Local") {
    res.json(MaterialClass);
  }
  if (enviornment === "Production") {
    db.select("ID", "Name", "Description")
      .from("MaterialClass")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all material classes");
});

module.exports = router;
