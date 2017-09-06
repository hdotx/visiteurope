/* Importing these packages/library into the gulpfile to be used */
var gulp = require('gulp');                 // Task runner
var gulpSass = require('gulp-sass');        // SASS compiler
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoPrefixer = require('gulp-autoprefixer');
var gulpClean = require('gulp-clean');      // Remove files
var gulpConcat = require('gulp-concat');    // Merge multiple files into one file
var browserify = require('gulp-browserify');
var mergeStream = require('merge-stream');
var gulpNewer = require('gulp-newer');
var imageMin = require('gulp-imagemin');
var gulpPartials = require('gulp-inject-partials');
var gulpMinify = require('gulp-minify');
var gulpCssMin = require('gulp-cssmin');
var gulpRename = require('gulp-rename');
var gulpHtmlMin = require('gulp-htmlmin');


// PATH to all SCSS files
var SOURCESPATH = {
    sassSource : 'src/scss/*.scss',
    sassPartialSource: 'src/scss/**',
    sassApp : 'src/scss/app.scss',
    htmlSource : 'src/scss/*.html',
    htmlPartialSource : 'src/scss/partial/*.html',
    jsSource : 'src/js/**',
    imgSource : 'src/img/**'
}

// PATH to the CSS directory
var APPPATH = {
    css : 'app/css',
    root: 'app/',
    js: 'app/js',
    font: 'app/fonts',
    img: 'app/img'
}



/* Garbage collection */
gulp.task('clean-html',function(){
    return gulp.src(APPPATH.root + '/*.html',{read: false, force: true})
           .pipe(gulpClean());
});

gulp.task('clean-scripts',function(){
    return gulp.src(APPPATH.root + '/*.js',{read: false, force: true})
           .pipe(gulpClean());
});


/* HTML partials task */
gulp.task('partials',function(){
    return gulp.src(SOURCESPATH.htmlSource)
        .pipe(gulpPartials())
        .pipe(gulp.dest(APPPATH.root));
});
/* Note: Any partial file must start with an underscore (_<filename>.html) */


/* Removing Bootstrap Support - No Copy of Bootstrap Fonts */
/* B-fonts move task */
// gulp.task('moveFonts', function(){
//
//     /* This way to copy certain files with specific extension */
//     gulp.src('./node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')
//         .pipe(gulp.dest(APPPATH.font))
// });


/* Script task */
gulp.task('scripts', function(){
    gulp.src(SOURCESPATH.jsSource)
    .pipe(gulpConcat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPPATH.js))
});


/* Minify Production Tasks Not To Be Run with Gulp Watch */
/*  Minify the JS file */
gulp.task('compress', function(){
    gulp.src(SOURCESPATH.jsSource)
    .pipe(gulpConcat('main.js'))
    .pipe(browserify())
    .pipe(gulpMinify())
    .pipe(gulp.dest(APPPATH.js))
});

/* Minify the CSS file  */
gulp.task('compressCss', function(){

  /* Removing Bootstrap support */
  //  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');

   var sassFiles;

       sassFiles = gulp.src('src/scss/app.scss')
      .pipe(autoPrefixer())
      .pipe(gulpSass({outputStyle: 'expanded'}).on('error', gulpSass.logError))

      /* Removing Bootstrap support */
      // return mergeStream(bootstrapCSS, sassFiles)
      .pipe(gulpConcat('app.css'))
      .pipe(gulpCssMin())
      .pipe(gulpRename({suffix: '.min'}))
      .pipe(gulp.dest('app/css'));
});


/* Minify the HTML file  */
gulp.task('compressHtml',function(){
   return gulp.src(SOURCESPATH.htmlSource)
       .pipe(gulpPartials())
       .pipe(gulpHtmlMin({collapseWhitespace:true}))
       // this option 'collapseWhitespace' remove white space in html
       .pipe(gulp.dest(APPPATH.root));
});
/* End of Production Task */


/* Sass compiling task */
gulp.task('sass', function(){
    /* Removing Bootstrap support */
    // var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');

    var sassFiles;


    //sassFiles = gulp.src('src/scss/app.scss')
    sassFiles = gulp.src(SOURCESPATH.sassApp)
       .pipe(autoPrefixer())  // CSS AutoPrefixer
       .pipe(gulpSass({outputStyle: 'expanded'}).on('error', gulpSass.logError))

       /* Removing Bootstrap support */
      //  return mergeStream(bootstrapCSS, sassFiles)

       .pipe(gulpConcat('app.css'))
       .pipe(gulp.dest('app/css'));
});


/* Copy image task */
gulp.task('images',function(){
    return gulp.src(SOURCESPATH.imgSource)
        .pipe(gulpNewer(APPPATH.img))
        .pipe(imageMin())
        .pipe(gulp.dest(APPPATH.img));
});


/* A Browser Sync task */
gulp.task('serve', ['sass'], function(){
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir : APPPATH.root
        }
    })
});


/* Gulp Watch - for Development of the Project */

/* Removing Bootstrap support by removing 'moveFonts' task */
// gulp.task('watch', ['serve', 'sass', 'partials', 'clean-html','scripts','moveFonts', 'images', 'partials'], function(){
gulp.task('watch', ['serve', 'sass', 'partials', 'clean-html','scripts', 'images', 'partials'], function(){
    gulp.watch([SOURCESPATH.sassSource, SOURCESPATH.sassPartialSource], ['sass']);
    gulp.watch([SOURCESPATH.jsSource], ['scripts']);
    gulp.watch([SOURCESPATH.imgSource], ['images']);
    gulp.watch([SOURCESPATH.htmlSource, SOURCESPATH.htmlPartialSource], ['partials']);
});


/* Gulp Default Tasks to run */
gulp.task('default',['watch']);


/* When you are done with Project Development */
/*    Final Production Compression - Only run at the end  */
gulp.task('production',['compress','compressCss','compressHTML'])
