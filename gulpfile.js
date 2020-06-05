"use strict"

const gulp = require("gulp");
const sass = require("gulp-sass");
const size = require('gulp-size');

const minify = require("gulp-minifier");
const concat = require("gulp-concat");
const image = require("gulp-image");

const browserSync = require('browser-sync').create();

//function style() {
//    return gulp.src('src/scss/**/*.scss')
//    .pipe(sass())
//    .pipe(gulp.dest('src/css'))
//    .pipe(browserSync.stream());
//}

function style() {
    return gulp.src('src/scss/**/*scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'));
}

function minifyCss() {
    return gulp.src('src/css/**/*.css')
    .pipe(minify({
        "maxLineLen": 80,
        "ugliComments": true
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(size())
    .pipe(browserSync.stream());
}


function minifyHtml() {
    return gulp.src('src/*.html')
    .pipe(minify({
        minify: true,
        minifyHTML: {
          collapseWhitespace: true,
          conservativeCollapse: true,
        },
        minifyJS: {
          sourceMap: true
        },
        minifyCSS: true,
        getKeptComment: function (content, filePath) {
            var m = content.match(/\/\*![\s\S]*?\*\//img);
            return m && m.join('\n') + '\n' || '';
        }
      }))
    .pipe(gulp.dest('dist'))
    .pipe(size())
    .pipe(browserSync.stream());
}

function minifyJs() {
    return gulp.src('src/js/**/*.js')
    .pipe(minify({
        "maxLineLen": 80,
        "ugliComments": true,
        minifyJS: {
            sourceMap: true
          }
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(size())
    .pipe(browserSync.stream());
}

function optImage() {
    return gulp.src('src/images/*')
    .pipe(image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        guetzli: false,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: true // defaults to false
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
}

function optIcon() {
    return gulp.src('src/icons/*')
    .pipe(image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        guetzli: false,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: true // defaults to false
    }))
    .pipe(gulp.dest('dist/icons'))
    .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
    gulp.watch('src/scss/**/*.scss', style);
    gulp.watch('src/js/**/*.js', minifyJs);
    gulp.watch('src/css/**/*.css', minifyCss);
    gulp.watch('src/*.html', minifyHtml);
    gulp.watch('src/images/*', optImage);
    gulp.watch('src/icons/*', optIcon);
    gulp.watch('dist/**/*').on('change', browserSync.reload);
}

exports.minifyJs = minifyJs;
exports.minifyCss = minifyCss;
exports.minifyHtml = minifyHtml;
exports.optImage = optImage;
exports.optIcon = optIcon;
exports.style = style;
exports.watch = watch;