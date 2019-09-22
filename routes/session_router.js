var router = require('express').Router();

// ***** routes require [ start ] *****
var user = require('./users');
var register = require('./register');
var index = require('./index');
// ***** routes require [ end ] *****

// ***** routes [ start ] *****
router.use('/', index);
router.use('/register', register);
router.use('/users', user);
// ***** routes [ end ] *****

module.exports = router;