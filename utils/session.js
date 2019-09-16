var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var connection = require('../db/connection');
var config = require('../config.json');

let sessionStoreOptions = {

    // checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    // expiration: 86400000,// The maximum age of a valid session; milliseconds.
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_name,
    port: config.db_port,
    connectionLimit: 1, //  more than one connection casusesrace conditions
    createDatabaseTable: true,
    charset: 'utf8mb4_bin',
    schema: {
        tableName: 'tbl_sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}
var sessionStore = new MySQLStore(sessionStoreOptions/* session store options*/);

module.exports = { session, sessionStore };