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

const connection = new sql.ConnectionPool(config);

connection
  .connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.on("done", (returnValue) => {
      console.log("Query completed successfully");
      console.log(returnValue.returnValue);
      connection.close();
    });

    request.on("error", (err) => {
      console.log("An error occurred while executing the query");
      console.log(err);
      connection.close();
    });
    request.query("SELECT * FROM Phase");
  })
  .catch((err) => {
    console.log("An error occurred while connecting to the database");
    console.log(err);
  });
