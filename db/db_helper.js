var pool = require('./connection');

/**
 * Executes SQL query and returns data.
 * @constructor
 * @param {string} queryText - SQL query string.
 * @param {boolean} singleRecord - single record.
 */
var querySQLSync = function (queryText, singleRecord) {
    return new Promise(function (resolve, reject) {
        pool.query(queryText, function (err, data, fields) {
            // Error
            if (err) return reject(err);
            // For single record
            if (typeof (singleRecord) == "boolean" && singleRecord) return resolve(data[0]);
            // For multiple records
            return resolve(data);
        });
    });
};

module.exports = {
    querySQLSync
};