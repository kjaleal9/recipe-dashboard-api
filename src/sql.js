const sql = require("mssql");

const config = {
  user: "TPMDB",
  password: "TPMDB",
  server: "localhost", // You can use 'localhost\\instance' to connect to named instance
  database: "TPMDB",
  stream: false,
  pool: {
    max: 20,
    min: 0,
    idleTimeoutMillis: 60000,
  },
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const appPool = new sql.ConnectionPool(config);

const databaseMiddleware = async (req, res, next) => {
  appPool.connect().then(async (pool) => {
    req.db = pool;
    next();
    console.log(req.db.available, req.db.borrowed, req.db.pending, req.db.size);
  });
};

module.exports = { appPool, databaseMiddleware };
