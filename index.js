const fs = require('fs')
const glob = require('glob')
const precinct = require('precinct')
const isBuiltInModule = require('is-builtin-module')

const PRECINCT_CONFIG = { es6: { mixedImports: true } }

const uniq = (arr = []) => (arr.length ? Array.from(new Set(arr)) : [])
const not = fn => (...args) => !fn(...args)
const or = (...fns) => (...args) => fns.some(fn => fn(...args))
const and = (...fns) => (...args) => fns.every(fn => fn(...args))

const existing = filename => fs.existsSync(filename)
const isDirectory = filename => fs.lstatSync(filename).isDirectory()
const withoutDirectoryOrMissing = and(not(isDirectory), existing)

const getDependenciesForFile = filename =>
  precinct.paperwork(filename, PRECINCT_CONFIG)

const isLocal = path => path.includes('./')
const withoutLocalOrBuiltinModules = and(not(isLocal), not(isBuiltInModule))

const stripPath = path => path.split('/')[0]

function getDependencies(globs) {
  const filenames = uniq(
    globs.reduce((globbed, input) => {
      let files = glob.sync(input)
      if (!files.length) files = [input]
      return globbed.concat(files)
    }, [])
  ).filter(withoutDirectoryOrMissing)

  const dependencies = uniq(
    filenames.reduce(
      (deps, filename) => deps.concat(getDependenciesForFile(filename)),
      []
    )
  )
    .filter(withoutLocalOrBuiltinModules)
    .map(stripPath)

  return dependencies
}

module.exports = getDependencies
