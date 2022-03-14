const oracledb = require('oracledb');

module.exports = getdb = async () => {
    const connection = await oracledb.getConnection({ user: "proyecto", password: "cbll2022", connectionString: "52.200.169.154:1521/xepdb1" });
    return connection;
}

