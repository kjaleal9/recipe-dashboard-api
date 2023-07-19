const express = require("express");
const cors = require("cors");
const recipes = require("./routes/recipes");
const materials = require("./routes/materials");
const processClasses = require("./routes/processClasses");
const phases = require("./routes/phases");
const equipment = require("./routes/equipment");
const parameters = require("./routes/parameters");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/recipes", recipes);
app.use("/materials", materials);
app.use("/process-classes", processClasses);
app.use("/phases", phases);
app.use("/equipment", equipment);
app.use("/parameters", parameters);

module.exports = app