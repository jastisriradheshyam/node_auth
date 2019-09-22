var router = require('express').Router();
const bearerToken = require('express-bearer-token');
var cors = require('cors');
var db = require('../../../db/db_helper');
var pass_hash = require('../../../utils/pass_hash');
var jwt = require('jsonwebtoken');

router.options('*', cors());
router.use(cors());
router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    db.querySQLSync(`SELECT * FROM users WHERE username = "${username}"`, true)
        .then((user) => {
            if (pass_hash.comparePassword({
                salt: user.salt,
                passwordHash: user.password
            }, password)) {
                console.log('match!')
                let jwtToken = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                    data: {
                        userID: user.username
                    }
                }, config.JWTSecret);
                console.log(jwtToken);
                return res.json({
                    success: true,
                    message: {
                        token: jwtToken
                    }
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Incorrect username and password.'
                });
            }
        })
        .catch((err) => {
            return res.json({
                success: false,
                message: "Internal server error"
            });
        });

});

router.use(bearerToken());
router.use((req, res, next) => {
    if (!req.token) {
        return res.json({
            success: false,
            message: "No token provided"
        });
    }
    next();
});
router.use((req, res, next) => {
    let token = req.token;
    jwt.verify(token, config.JWTSecret, (err, decoded) => {
        if (err) {
            return res.send({
                success: false,
                message: err.message
            });
        }
        let username = decoded.data.userID;
        db.querySQLSync(`SELECT * FROM users WHERE username = "${username}"`, true)
            .then((user) => {
                if (user) {
                    req.user = user;
                    return next();
                }
                res.json({
                    success: false,
                    message: "not  a valid user"
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: "Internal server error"
                });
            });
    });
});

router.get('/test', (req, res, next) => {
    console.log(req.user);
    res.json({
        success: true,
        message: req.user
    })
});

router.use((req, res, next) => {
    res.json({
        success: false,
        message: "wrong API route : " + req.originalUrl
    })
});

module.exports = router;