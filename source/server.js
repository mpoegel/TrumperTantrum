'use strict';

var express = require('express'),
    lessMiddleware = require('less-middleware'),
    app = express();

app.use(lessMiddleware(
  __dirname + '/public',
  { force: true }
));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/', require('./routes'));

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.render('error.jade', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(8000, function() {
  var host = server.address().address,
      port = server.address().port;
  console.log('App running at http://%s%s', host, port);
});
