var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

router.get("/", function (req, res, next) {
    console.log(req.session);
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.post('/',
    function (req, res, next) {
    // passport.authenticate('local', {
    //     successRedirect: '/users',
    //     failureRedirect: '/'
    // })
    passport.authenticate('local', {},function(err, user, info, status) {
        // console.log(err);
        // console.log(user);
        // console.log(info);
        // console.log(status);
        // if (err) {
        // }
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }
        req.logIn(user, async function(err) {
          if (err) { return next(err); }
        //   console.log("before delay")
        //   await delay(2000);
        //   console.log("after delay")
          return res.redirect('/users');
        });
        // return res.redirect('/users');

    })(req, res, next);
    }
);

var delay = function(dTime){
    return new Promise(r => setTimeout(r, dTime));
}
module.exports = router;