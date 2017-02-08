
const path = require('path')

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const lazypipe = require('lazypipe')

const del = require('del')

const nib = require('nib')
const rupture = require('rupture')

// ----------------------------------------------------------

const config = {
  // src: './npm/*.styl',
  src: './src/**/!(_)*.styl',
  libs: './_mixins/*.styl',
  dest: './css',
  stylus: {
    import: [
      path.resolve('./_mixins'),
      'nib',
      'rupture'
    ],
    use: [
      nib(),
      rupture()
    ]
  }
}

// ----------------------------------------------------------

const stylusBuild = lazypipe()
  .pipe($.sourcemaps.init)
  .pipe($.stylus, config.stylus)
  .pipe($.sourcemaps.write)

// ----------------------------------------------------------

gulp.task('clean', () => {
  del.sync(config.dest)
})

// ----------------------------------------------------------

gulp.task('stylus', () => {
  gulp.src(config.src)
    .pipe($.newer(config.dest))
    // .pipe($.sourcemaps.init())
    // .pipe($.stylus({
    //   import: [
    //     config.stylus.import,
    //     'nib',
    //     'rupture'
    //   ],
    //   use: [
    //     nib(),
    //     rupture()
    //   ]
    // }))
    // .pipe($.sourcemaps.write())
    .pipe(stylusBuild())
    .pipe(gulp.dest(config.dest))
})

gulp.task('stylus:all', () => {
  gulp.src(config.src)
    // .pipe($.sourcemaps.init())
    // .pipe($.stylus({
    //   import: [
    //     config.stylus.import,
    //     'nib',
    //     'rupture'
    //   ],
    //   use: [
    //     nib(),
    //     rupture()
    //   ]
    // }))
    // .pipe($.sourcemaps.write())
    .pipe(stylusBuild())
    .pipe(gulp.dest(config.dest))
})

// ----------------------------------------------------------

gulp.task('default', ['stylus:all'], () => {
  gulp.watch(config.src, ['stylus'])
  gulp.watch(config.mixins, ['stylus:all'])
})
