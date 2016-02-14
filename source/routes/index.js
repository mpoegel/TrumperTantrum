'use strict';

var express = require('express'),
    router = express.Router();

router.use('/libs', require('./libs.js'));

router.get('/', function(req, res) {
  res.render('index.jade', {
    title: 'TrumperTantrum'
  });
});

module.exports = router;
