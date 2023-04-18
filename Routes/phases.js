const express = require("express");
const router = express.Router();
const { Phase } = require("../LocalDatabase/TPMDB");
const enviornment = "Local";

router.get("/", (req, res) => {
  res.json(Phase);
});

router.get("/:ID", (req, res) => {
  console.log(req.params.ID);
  res.json(Phase.find((phase) => phase.ID === +req.params.ID));
});

module.exports = router;
