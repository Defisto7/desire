var gulp         = require('gulp'),
		sass         = require('gulp-sass')(require('sass')),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify-es').default,
		cleanCSS     = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
		del          = require('del'),
		imagecomp    = require("compress-images"),
		cache        = require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer'),
		ftp          = require('vinyl-ftp'),
		notify       = require("gulp-notify"),
		rsync        = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done() };

gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.+(scss|sass)')
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({
		// grid: true, // Optional. Enable CSS Grid
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.stream())
});

// Пользовательские скрипты проекта

gulp.task('js', function() {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'src/libs/slick/slick.js',
		'node_modules/mixitup/dist/mixitup.js',
		'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
		'src/js/main.js', // Всегда в конце
		])
	.pipe(concat('main.min.js'))
	.pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('imagemin', async function() {
	imagecomp(
		"dist/img/**/*",
		"dist/img/",
		{ compress_force: false, statistic: true, autoupdate: true }, false,
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } },
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) {
			if (completed === true) {
				// browserSync.reload()
			}
		}
	)
});

gulp.task('removedist', function() { return del(['dist'], { force: true }) });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('buildFiles', function() { return gulp.src(['src/*.html', 'src/.htaccess']).pipe(gulp.dest('dist')) });
gulp.task('buildCss', function() { return gulp.src(['src/css/main.min.css']).pipe(gulp.dest('dist/css')) });
gulp.task('buildJs', function() { return gulp.src(['src/js/main.min.js']).pipe(gulp.dest('dist/js')) });
gulp.task('buildFonts', function() { return gulp.src(['src/fonts/**/*']).pipe(gulp.dest('dist/fonts')) });

gulp.task('build', gulp.series('removedist', 'imagemin', 'sass', 'js', 'buildFiles', 'buildCss', 'buildJs', 'buildFonts'));

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('src/')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'criska7@gmail.com',
		destination: '#',
		// include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('code', function() {
	return gulp.src('dist/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
	gulp.watch('src/sass/**/*.+(scss|sass)', gulp.parallel('sass'));
	gulp.watch(['libs/**/*.js', 'src/js/main.js'], gulp.parallel('js'));
	gulp.watch('src/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'js', 'browser-sync', 'watch'));
