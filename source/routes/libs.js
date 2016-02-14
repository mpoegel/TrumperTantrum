'use strict';

var express = require('express'),
    router = express.Router(),
    modules_route = '../../../node_modules',
    libs_route = '../../../libs';

router.get('/jquery.min.js', function(req, res) {
  res.sendFile('jquery/dist/jquery.min.js', {
    root: __dirname + modules_route
  });
});

router.get('/enchant.min.js', function(req, res) {
  res.sendFile('enchant/enchant.min.js', {
    root: __dirname + libs_route
  });
});

module.exports = router;
