var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var bower = require('gulp-bower');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var spawn = require('gulp-spawn');
//var livereload = require('gulp-livereload');

var env = process.env.NODE_ENV || 'production';
//NODE_ENV=production gulp //dev

var paths = {
  scripts: [
    'src/js/app.js'
  ],
  fonts: [
  	'src/bower_components/bootstrap/fonts/*',
  	'src/bower_components/fontawesome/fonts/*'
  ],
  less: 'src/less/app.less',
  vendor_scripts: [
    'src/bower_components/simpleStorage/simpleStorage.js',
    'src/bower_components/jquery/dist/jquery.min.js',
    'src/bower_components/bootstrap/dist/js/bootstrap.min.js'
  ],
  images: [
    'src/img/**/*',
    '!src/img_bucket/**',
    '!src/bower_components/**'
  ],
  copy: [
    'src/.htaccess',
    'src/.gitignore',
    'src/robots.txt'  
  ],
};

var jekyll = function(){
  gulp.src(['./index.html', './_layouts/*.html', './_posts/*.{markdown,md}'], { buffer: false })
    .pipe(spawn({
      'cmd': 'jekyll', 
      'args': ['build']
    })
  );
};

gulp.task('bower', function() {
  return bower();
});

gulp.task('copy', function() {
    gulp.src(paths.copy).pipe(gulp.dest('.'))
      //.on('end', jekyll)
    ;

});

gulp.task('less', function() {
    gulp.src(paths.less)
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ],
        relativeUrls: false
      }))
      .pipe(autoprefixer())
      .pipe(minifyCSS({
        'rebase' : false
      }))
      .pipe(gulp.dest('./css'))
      //.on('end', jekyll)
    ;

});

gulp.task('js_assets', function() {
	gulp.src(paths.vendor_scripts)
    .pipe(concat('assets.min.js'))
    .pipe(gulp.dest('./js'))
    //.on('end', jekyll)
  ;
});

gulp.task('jekyll', function() {
  jekyll();
});

gulp.task('js', function() {
	gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('./js'))
    //.on('end', jekyll)
  ;
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./img'))
    //.on('end', jekyll)
  ;
});

gulp.task('fonts', function() {
	gulp.src(paths.fonts)
    .pipe(gulp.dest('./fonts'))
    //.on('end', jekyll)
  ;

});



gulp.task('watch', function(){
  //livereload.listen();
	gulp.watch(paths.copy, ['copy']);
	gulp.watch(paths.less, ['less']);
	gulp.watch(paths.scripts, ['js']);
	gulp.watch(paths.images, ['images']);
  gulp.watch(['./src/jekyll/**/*'], ['jekyll']);
});

gulp.task('default', ['watch', 'jekyll', 'copy', 'less', 'js', 'fonts', 'js_assets',  'images']);

