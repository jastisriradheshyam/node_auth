// ***** config [ start ] *****
require('./utils/setConfig');
// ***** config [ end ] *****

const express = require('express');
var { session, sessionStore } = require('./utils/session');
var passport = require('passport');
var bodyParser = require('body-parser');

// passport auth setup
require('./utils/user_auth');

// ***** router imports [ start ] *****
var sessionRouter = require('./routes/session_router');
var APIRouter = require('./routes/api_router');
// ***** router imports [ end ] *****

// instantiating express app
const app = express();

// ***** body parsing [ start ] *****
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// ***** body parsing [ end ] *****

// ***** API [ start ] *****
app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
})
app.use("/api", APIRouter);
// ***** API [ end ] *****

// ***** session and auth [ start ] *****
app.use(session({
    // name: 'key',
    secret: 'secret',
    store: sessionStore,
    resave: false,
    // rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 600000, secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/logout', (req, res, next) => {
    req.logOut();
    res.send("logged out");
})
// setting router
app.use(sessionRouter);
// ***** session and auth [ end ] *****

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));