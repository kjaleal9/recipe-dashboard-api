const express = require("express");
const cors = require("cors");
const knex = require("knex");
const recipes = require("./routes/recipes");
const materials = require("./routes/materials");
const processClasses = require("./routes/processClasses");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    port: 5432,
    password: "pizza",
    database: "TPMDB",
  },
  useNullAsDefault: true,
});

const app = express();

app.use(express.json());
app.use(cors());
app.use("/recipes", recipes);
app.use("/materials", materials);
app.use("/process-classes", processClasses);

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
