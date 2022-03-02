const oracledb = require('oracledb');
const port = 3000;

async function checkConnection() {

  let connection;

  try {
    connection = await oracledb.getConnection({ user: "brian", password: "admin", connectionString: "localhost/xepdb1" });
    
    console.log("Connected to Oracle Database");

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Close connection success");
      } catch (err) {
        console.error(err);
      }
    }
  }
}

checkConnection();