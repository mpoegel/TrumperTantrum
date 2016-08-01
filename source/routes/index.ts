/**
 * routes/index.ts
 */
/// <reference path="../../typings/index.d.ts" />
'use strict';

import express = require('express');

let router = express.Router();

router.use('/libs', require('./libs.js'));

router.get('/', function(req, res) {
  res.render('index.jade', {
    title: 'TrumperTantrum'
  });
});

module.exports = router;
