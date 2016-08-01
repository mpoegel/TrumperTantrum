/**
 * gulpfile.js
 */
'use strict';

let gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    ts = require('gulp-typescript'),
    execFile = require('child_process').execFile;

let ts_project = ts.createProject('tsconfig.json');

gulp.task('default', ['watch', 'nodemon']);

gulp.task('nodemon', ['ts'], function(done) {
  nodemon({ script: './source/server.js' });
});

gulp.task('ts', function() {
  var ts_result = ts_project.src()
    .pipe(ts(ts_project));
  return ts_result.js.pipe(gulp.dest('./source'));
});

gulp.task('watch', function() {
  gulp.watch([ './source/**/*.ts' ], ['ts']);
});
