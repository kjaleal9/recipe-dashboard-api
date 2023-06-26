const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const recipes = require("./routes/recipes");
const materials = require("./routes/materials");
const processClasses = require("./routes/processClasses");
const phases = require("./routes/phases");
const equipment = require("./routes/equipment");
const parameters = require("./routes/parameters");

const app = express();

const config = {
  user: "TPMDB",
  password: "TPMDB",
  server: "localhost", // You can use 'localhost\\instance' to connect to named instance
  database: "TPMDB",
  stream: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 5000,
  },
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};
const appPool = new sql.ConnectionPool(config);

app.use(express.json());
app.use(cors());
app.use("/recipes", recipes);
app.use("/materials", materials);
app.use("/process-classes", processClasses);
app.use("/phases", phases);
app.use("/equipment", equipment);
app.use("/parameters", parameters);

appPool
  .connect()
  .then(function (pool) {
    app.locals.db = pool;
    const server = app.listen(5000, function () {
      const host = server.address().address;
      const port = server.address().port;
      console.log("Example app listening at http://%s:%s", host, port);
    });
  })
  .catch(function (err) {
    console.error("Error creating connection pool", err);
  });

// app.listen(5000, () => {
//   console.log("app is running on port 5000");
// });
