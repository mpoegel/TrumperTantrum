/**
 * routes/libs.ts
 */
/// <reference path="../../typings/index.d.ts" />
'use strict';

import express = require('express');

let router = express.Router(),
    modules_route = '../../../node_modules',
    libs_route = '../../../libs';

router.get('/jquery.min.js', function(req, res) {
  res.sendFile('jquery/dist/jquery.min.js', {
    root: __dirname + modules_route
  });
});

router.get('/phaser.min.js', function(req, res) {
  res.sendFile('phaser/dist/phaser.min.js', {
    root: __dirname + modules_route
  });
});

module.exports = router;
