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
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');
//var livereload = require('gulp-livereload');

var env = process.env.NODE_ENV || 'production';
//NODE_ENV=production gulp //dev

var paths = {
  scripts: [
    'src/js/app.js'
  ],
  fonts: [
  	'bower_components/bootstrap/fonts/*',
  	'bower_components/fontawesome/fonts/*'
  ],
  less: 'src/less/app.less',
  vendor_scripts: [
    'bower_components/simpleStorage/simpleStorage.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js'
  ],
  images: [
    'src/img/**/*',
    '!src/img_bucket/**',
    '!bower_components/**'
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
    gulp.src(paths.copy).pipe(gulp.dest('.'));

    gulp.src('bower_components/picturefill/dist/picturefill.min.js').pipe(gulp.dest('./js/'));

    gulp.src('src/js/modernizr.min.js').pipe(gulp.dest('./js/'));

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
    ;

});

gulp.task('js_assets', function() {
	gulp.src(paths.vendor_scripts)
    .pipe(concat('assets.min.js'))
    .pipe(gulp.dest('./js'))
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
  ;
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./img'))
  ;
});

gulp.task('media-images', function() {
  gulp.src('src/media-img/**/*')
    .pipe(imageResize({
      width : 50,
      height : 50,
      crop : true,
      upscale : false,
      format : 'jpg',
      imageMagick: true
    }))
    .pipe(rename(function (path) {
      path.basename += "-50x50";
    }))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./media-img'))
  ;

  gulp.src('src/media-img/**/*')
    .pipe(imageResize({
      width : 100,
      height : 100,
      crop : true,
      upscale : false,
      format : 'jpg',
      imageMagick: true
    }))
    .pipe(rename(function (path) {
      path.basename += "-100x100";
    }))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./media-img'))
  ;
});

gulp.task('fonts', function() {
	gulp.src(paths.fonts)
    .pipe(gulp.dest('./fonts'))
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

