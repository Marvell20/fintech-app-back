const oracledb = require('oracledb');

module.exports = getdb = async () => {
    const connection = await oracledb.getConnection({ user: "brian", password: "admin", connectionString: "localhost/xepdb1" });
    return connection;
}

