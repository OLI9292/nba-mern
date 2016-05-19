var gulp = require('gulp');
var fs = require("fs");
var source = require('vinyl-source-stream')
var browserify = require("browserify");
var watchify = require('watchify');

gulp.task('bundle', function() {
  browserify("src/App.js")
    .transform("babelify", {presets: ["react"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('static/'));
});

gulp.task('watch', function() {
  var b = browserify({
    entries: ['src/App.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify]
  });

  b.on('update', bundle);

  function bundle() {
    b.transform("babelify", {presets: ["react"]})
      .bundle()
      .on('error', function (err) { 
        console.error(err.message, err.codeFrame);
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('static/'));
    console.log('Update succesful.');
  };

  bundle();
  return b;
});
