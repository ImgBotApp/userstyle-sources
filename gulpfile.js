
const path = require('path')

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const lazypipe = require('lazypipe')

const argv = require('yargs').argv
const del = require('del')
const nib = require('nib')


// ----------------------------------------------------------

const config = {
  src: './src/!(_)**/!(_)*.styl',
  mixins: [
    './src/_mixins/*.styl',
    './src/!(_)**/_*.styl'
  ],
  dest: './css',
  stylus: {
    import: [
      path.resolve('./src/_mixins'),
      'nib'
    ],
    use: [
      nib()
    ]
  }
}

const name = argv.s || argv.single

if (name) {
  config.src = `src/${name}/!(_)*.styl`
  config.mixins[1] = `src/${name}/_*.styl`
}


// ----------------------------------------------------------

// function getArgument(name) {
//   const argv = process.argv.slice(1)

//   const idx = argv.indexOf('--' + name)

//   if (idx !== -1) {
//     const nidx = idx + 1, nv = argv[nidx]

//     return nidx === argv.length || nv.startsWith('--')
//       ? true
//       : nv
//   }
// }

// ----------------------------------------------------------

const accordBuild = lazypipe()
  .pipe($.sourcemaps.init)
  .pipe($.accord, 'stylus', config.stylus)
  .pipe($.sourcemaps.write)


// ----------------------------------------------------------

gulp.task('clean', () => {
  del.sync(config.dest)
})

// ----------------------------------------------------------

gulp.task('single', () => {
  gulp.src(config.src)
    .pipe($.newer(config.dest))
    .pipe(accordBuild())
    .pipe(gulp.dest(config.dest))
})

// ----------------------------------------------------------

gulp.task('stylus', () => {
  gulp.src(config.src, { base: 'src' })
    .pipe($.debug({ title: 'stylus | src' }))
    .pipe($.newer(config.dest))
    .pipe(accordBuild())
    .pipe(gulp.dest(config.dest))
})

gulp.task('stylus:all', () => {
  gulp.src(config.src, { base: 'src' })
    .pipe($.debug({ title: 'stylus:all | src' }))
    .pipe(accordBuild())
    .pipe(gulp.dest(config.dest))
})


// ----------------------------------------------------------

gulp.task('build', [ 'stylus:all' ])

// ----------------------------------------------------------

gulp.task('watch', [ 'build' ], () => {
  gulp.watch(config.src,    [ 'stylus' ])
  gulp.watch(config.mixins, [ 'stylus:all' ])
})

// ----------------------------------------------------------

gulp.task('default', [ 'watch' ])
