
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
  src: 'src/**/!(_)*.styl',
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

function getArgument(name) {
  const argv = process.argv.slice(1)
  console.log(argv.join('\n'))

  const idx = argv.indexOf('--' + name)

  if (idx !== -1) {
    const nidx = idx + 1, nv = argv[nidx]

    return nidx === argv.length || nv.startsWith('--')
      ? true
      : nv
  }
}

const name = getArgument('single')
console.log(`name: ${name}`)

const src = name
  ?  `src/${name}/!(_)*.styl`
  : config.src

console.log(`src: ${src}`)


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
  gulp.src(src)
    .pipe($.newer(config.dest))
    .pipe(accordBuild())
    .pipe(gulp.dest(config.dest))
})

// ----------------------------------------------------------

gulp.task('stylus', () => {
  gulp.src(src, { base: 'src' })
    .pipe($.debug({ title: 'stylus | src' }))
    .pipe($.newer(config.dest))
    .pipe(accordBuild())
    .pipe(gulp.dest(config.dest))
})

gulp.task('stylus:all', () => {
  gulp.src(src, { base: 'src' })
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
