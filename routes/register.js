var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var db = require('../db/db_helper');

router.get('/', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/register.html'));
});

router.post('/', function (request, response, next) {
    console.log(request.body);
    db.querySQLSync(`INSERT INTO users (username, password) VALUES ("${request.body.username}", "${request.body.password}")`, true)
        .then(() => {
            response.sendStatus(200);
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;