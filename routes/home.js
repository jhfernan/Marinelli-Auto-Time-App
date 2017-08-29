'use strict'

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/timekeeper', function(req, res, next) {
	res.render('home/home', { title: 'Time Keeper' });
});

module.exports = router;
