const gulp = require ("gulp")
const sass = require ("gulp-sass")
const autoprefixer = require ("gulp-autoprefixer")

// Main task
gulp.task('default', () => {
  // Watchers
  gulp.watch('./src/scss/**/*.scss', gulp.series(['styles']))
})

// Compile SCSS
gulp.task('styles', () => {
  return gulp
    .src('./src/scss/main.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(gulp.dest('./public/stylesheets'))
})
