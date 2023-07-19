const http = require('http')
const dotenv = require("dotenv");
const appPool = require('./sql')
const app = require('./app')

dotenv.config();

// appPool
//   .connect()
//   .then(function (pool) {
//     app.locals.db = pool;
//     app.locals.db.on('acquire',()=>{
//       console.log('Connection')
//     })
    const server = http.createServer(app)
    server.listen(process.env.PORT || 5001, () => {
      const host = server.address().address;
      const port = server.address().port;
      console.log("Example app listening at http://%s:%s", host, port);
    });
  // })
  // .catch(function (err) {
  //   console.error("Error creating connection pool", err);
  // });
