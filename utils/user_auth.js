var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var db = require('../db/db_helper');
var pass_hash = require('./pass_hash');

// setting up the auth statergy
// and runs when user is authenticated
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'password'
},
    function (req, username, password, done) {

        console.log('called local');

        console.log('called local - pg');

        db.querySQLSync(`SELECT * FROM users WHERE username = "${username}"`, true)
            .then((user) => {
                if (pass_hash.comparePassword({
                    salt:user.salt,
                    passwordHash: user.password
                }, password)) {
                    console.log('match!')
                    done(null, user);
                } else {
                    done(null, false, { message: 'Incorrect username and password.' });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
));

// runs when user is logged in or authenticated
passport.serializeUser(function (user, done) {
    console.log('called serializeUser');
    console.log(user)
    done(null, user.id);
});

// runs on every call when user has be authenticated
passport.deserializeUser(function (id, done) {
    console.log('called deserializeUser');
    db.querySQLSync(`SELECT * FROM users WHERE id = "${id}"`, true)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            console.log(err);
        });
});