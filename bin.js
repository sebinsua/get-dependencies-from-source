#!/usr/bin/env node

const getDependencies = require('.')

const globs = process.argv.slice(2)

if (globs.length === 0) {
  console.error(
    'get-dependencies-from-source: requires at least one file/glob argument.'
  )
  process.exit(1)
}

const dependencies = getDependencies(globs)

console.log(dependencies)
