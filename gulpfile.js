const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'src/',
            index: "index.html"
        }
    });
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('src/img/**/*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
        .pipe(dest('dist/img'))
}

function ttfTowoff() {
    return src('src/fonts/*.ttf')
        .pipe(ttf2woff())
        .pipe(dest('src/fonts'))
}

function ttfTowoff2() {
    return src('src/fonts/*.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('src/fonts'))
}

function scripts() {
    return src([
        //'node_modules/jquery/dist/jquery.js',
        'src/js/functions.js',
        'src/js/script.js'
    ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src([
        'src/scss/style.scss'
    ])
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'src/css/style.min.css',
        'src/fonts/**/*',
        'src/js/script.min.js',
        'src/*.html'
    ], { base: 'src' })
        .pipe(dest('dist'))
}

function watching() {
    watch(['src/scss/**/*.scss'], styles)
    watch(['src/*.html']).on('change', browserSync.reload);
    watch(['src/js/**/*.js', '!src/js/script.min.js']).on('change', scripts);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;
exports.images = images;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching, ttfTowoff, ttfTowoff2);