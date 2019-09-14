const express = require('express');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser')

// auth setup
require('./utils/user_auth');

var router = require('./routes/router');

const app = express();

// ***** body parsing [ start ] *****
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// ***** body parsing [ end ] *****

// ***** session and auth [ start ] *****
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 600000, secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/logout', (req, res, next) => {
    req.logOut();
    res.send("logged out");
})
// ***** session and auth [ end ] *****

// setting router
app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));