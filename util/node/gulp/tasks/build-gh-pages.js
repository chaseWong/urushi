var gulp = require('gulp'),
	pageConfig = require('../gh-pages-config.js'),
	rimraf = require('rimraf'),
	runSequence = require('run-sequence');

gulp.task('copy-dest', function () {
	'use strict';

	return gulp.src(pageConfig.trans.src, {base : '../../../dest'}).pipe(gulp.dest(pageConfig.trans.dest));
});

gulp.task('clean-gh-pages', function () {
	'use strict';
	runSequence(['clean-gh-pages-0', 'clean-gh-pages-1', 'clean-gh-pages-2']);
});
gulp.task('clean-gh-pages-0', function (cb) {
	'use strict';

	return rimraf(pageConfig.clean[0], cb);
});
gulp.task('clean-gh-pages-1', function (cb) {
	'use strict';
	return rimraf(pageConfig.clean[1], cb);
});
gulp.task('clean-gh-pages-2', function (cb) {
	'use strict';
	return rimraf(pageConfig.clean[2], cb);
});

gulp.task('build-gh-pages', function () {
	'use strict';

	return runSequence(
		['clean', 'clean-gh-pages-0', 'clean-gh-pages-1', 'clean-gh-pages-2'],
		['scss-build-to-dest', 'js-build'],
		'copy-dest',
		'clean'
	);
});