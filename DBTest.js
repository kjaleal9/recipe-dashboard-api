const sql = require("mssql");

const config = {
  user: "TPMDB",
  password: "TPMDB",
  server: "localhost", // You can use 'localhost\\instance' to connect to named instance
  database: "TPMDB",
  stream: false,
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

const testString = "BT0512_TeaMixing";
const testVersion = 1;

// Add an event listener for the 'error' event
pool.on("error", (err) => {
  console.error("Error occurred:", err);
});

// Add an event listener for the 'connect' event
pool.on("connect", (conn) => {
  console.log("Connection established:", conn);
});

// Add an event listener for the 'disconnect' event
pool.on("disconnect", (conn) => {
  console.log("Connection closed:", conn);
});

// Use the connection pool to execute a SQL statement
pool
  .connect()
  .then(() => {
    console.time("Connection");
    return pool.request().query(`
    SELECT id,Recipe_RID,Recipe_Version, TPIBK_Steptype_ID,processclassphase_id,Step,userstring,recipeequipmenttransition_data_id,nextstep,allocation_type_id,latebinding,material_id,ProcessClass_ID
    FROM TPIBK_RecipeBatchData
    WHERE Recipe_RID = '${testString}' AND Recipe_Version = ${testVersion}
    ORDER BY step`);
  })
  .then((result) => {
    console.log("Query result:", result);
  })
  .catch((err) => {
    console.error("Query error:", err);
  })
  .finally(() => {
    pool.close();
    console.timeEnd("Connection");
  });
