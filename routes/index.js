var express = require('express');
var router = express.Router();
var samples = require('../samples/samples');

/* GET home page. */
router.get('/test', function(req, res) {





    res.render('index');
});

module.exports = router;
