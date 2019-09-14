var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var db = require('../db/db_helper');
var pass_hash = require('../utils/pass_hash');

router.get('/', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/register.html'));
});

router.post('/', function (request, response, next) {
    console.log(request.body);
    // creating hash of the password (password hash and salt)
    let passwordObj = pass_hash.saltHashPassword(request.body.password);

    db.querySQLSync(`INSERT INTO users (username, password, salt) VALUES ("${request.body.username}", "${passwordObj.passwordHash}", "${passwordObj.salt}")`, true)
        .then(() => {
            response.sendStatus(200);
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;