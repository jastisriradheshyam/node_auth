var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log(req.session)
    console.log(req.user);
    console.log(req.authInfo);
    res.send(req.isAuthenticated());
});

module.exports = router;