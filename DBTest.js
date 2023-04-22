const sql = require('mssql');

const config = {
  user: 'TPMDB',
  password: 'TPMDB',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
  database: 'TPMDB',
  stream: false,
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,}

};

const connect = async () => {
  try {
    let pool = await sql.connect(config);
    let result1 = await pool
      .request()

      .query('select * from Phase');

    console.dir(result1);
  } catch (err) {
    // ... error checks
    console.error(err);
  }
};

connect()

sql.on('error', err => {
  // ... error handler
  console.log('ERRRO');
});
