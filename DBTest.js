const sql = require("mssql");

const sqlConfig = {
  user: "TPEngineer",
  password: "TPMDB",
  database: "TPMDB",
  server: "localhost\\SQLEXPRESS",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

const connectDB = async () => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const result = await sql.query`select * from Phase`;
    console.dir(result);
  } catch (err) {
    // ... error checks
    console.error(err);
  }
};

connectDB();
