var router = require('express').Router();
var APIV1 = require('./api/v1/router');

router.use('/v1', APIV1);

/**
 * default API route
 */
router.use((req, res, next) => {
    res.json({
        success:false,
        message: "Specify the API version e.g.: /api/v1, /api/v2, etc"
    });
});
module.exports = router;