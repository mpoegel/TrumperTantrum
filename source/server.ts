/**
 * server.ts
 */
/// <reference path="../typings/index.d.ts" />
'use strict';

import express = require('express');
import lessMiddleware = require('less-middleware');

let app = express();

app.use(lessMiddleware(
  __dirname + '/public',
  { force: true }
));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/', require('./routes'));

// app.use(function(err, req, res, next) {
//   console.log(err);
//   res.status(err.status || 500);
//   res.render('error.jade', {
//     message: err.message,
//     error: {}
//   });
// });

let server = app.listen(8000, function() {
  let host = server.address().address,
      port = server.address().port;
  console.log('App running at http://%s%s', host, port);
});
