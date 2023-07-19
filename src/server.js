const sql = require("mssql");
const dotenv = require("dotenv");
const app = require('./app')

dotenv.config();

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

appPool
  .connect()
  .then(function (pool) {
    app.locals.db = pool;
    const server = app.listen(process.env.PORT || 5001, function () {
      const host = server.address().address;
      const port = server.address().port;
      console.log("Example app listening at http://%s:%s", host, port);
    });
  })
  .catch(function (err) {
    console.error("Error creating connection pool", err);
  });
