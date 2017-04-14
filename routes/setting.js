/**
 * Created by hyochan on 12/19/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('partials/setting', {

    });
});

module.exports = router;
