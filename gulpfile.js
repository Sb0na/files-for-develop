let gulp        = require('gulp');
let stylus      = require('gulp-stylus');
let browserSync = require('browser-sync');
let concat      = require('gulp-concat');
let uglify      = require('gulp-uglifyjs');
let cssnano     = require('gulp-cssnano');
let rename      = require('gulp-rename');
let del         = require('del');
let imageMin    = require('gulp-imagemin');
let pngQuant    = require('imagemin-pngquant');
let cache       = require('gulp-cache');
let autoprefixer = require('gulp-autoprefixer');

gulp.task('styl', function() {
    return gulp.src('app/stylus/**/*.styl')
    .pipe(stylus())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(cssnano())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
    return gulp.src([
        // 'app/libs/jquery.v1.12.4.js',           //Какие либы грузить
        // 'app/libs/freewall.js',
        //'app/libs/magnific-popup.min.js',
    ])
    .pipe(concat('libs.min.js'))            //как будет выглядеть файл
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['styl'], function() {
    return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
    .pipe(cache(imageMin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngQuant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/stylus/**/*.styl', ['styl']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'styl', 'scripts'], function() {
    let buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'])
        .pipe(gulp.dest('dist/css'));

    let buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    let buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    let buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});