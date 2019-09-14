const express = require('express');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser')
var db = require('./db/db_helper');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var localStrategy = require('passport-local').Strategy;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000, secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

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
                if (password == user.password) {
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

passport.serializeUser(function (user, done) {
    console.log('called serializeUser');
    console.log(user)
    done(null, user.id);
});

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


// Routes
var index = require('./routes/index');

app.use('/', index);


var register = require('./routes/register');

app.use('/register', register);

var user = require('./routes/users');

app.use('/users', user);


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));