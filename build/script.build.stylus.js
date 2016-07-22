var
  fs = require('fs'),
  path = require('path'),
  stylus = require('stylus'),
  themes = ['ios', 'mat']

function readFile (file) {
  return fs.readFileSync(file, 'utf-8')
}

function compile (src) {
  var data = ''

  src.forEach(function (file) {
    data += readFile(file) + '\n'
  })

  return data
    // remove imports
    .replace(/@import '[^']+'\n/g, '')
    // remove comments
    .replace(/(\/\*[\w'-\.,`\s\r\n\*]*\*\/)|(\/\/[\w\s']*)/g, '')
    // remove unnecessary newlines
    .replace(/\n[\n]+/g, '\n')
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

themes.forEach(function (theme) {
  var
    src = 'src/themes/quasar.' + theme + '.styl',
    dest = 'dist/quasar.' + theme + '.styl',
    deps,
    data

  deps = stylus(readFile(src))
    .set('paths', [path.join(__dirname, '../src/themes/')])
    .deps()

  data = compile([src].concat(deps))

  fs.writeFileSync(dest, data, 'utf-8')
  console.log(dest.bold + ' ' + getSize(data).gray)
})
