'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    execFile = require('child_process').execFile;
gulp.task('default', ['nodemon']);

gulp.task('nodemon', function(done) {
  nodemon({ script: './source/server.js' });
});
