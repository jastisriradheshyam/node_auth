var mysql = require('mysql');

var pool;
const sqlOptions = {
    connectionLimit: 20, //important
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_name,
    port: config.db_port,
    multipleStatements: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    debug: true
}

try {
    pool = mysql.createPool(sqlOptions);
} catch (error) {
    console.log("Connection Pool Error : ", error);
}

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection) connection.release()

    return
});

module.exports = pool;