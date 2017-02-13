var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', ['build']);

gulp.task('build', function () {
	return gulp.src(["./deferred.js", "./deferredReplace.js"])
		.pipe(concat("deferred.js"))
		.pipe(gulp.dest('./dist'));
});
