'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const glob = require('glob');
const globToRegExp = require('glob-to-regexp');


function parse (term) {
  let match

  try {
    match = term.match(/^pass\s+(.+)/)[1]
  } catch (error) {
    return null
  }

  if (match.split(' ')[1] && match.split(' ')[0].indexOf('gen') > -1){
    return {
      action: 'generate',
      query: match.split(' ')[1] || ''
    }
  } else if (match) {
    return {
      action: 'grep',
      query: match
    }
  }
  return null;
}

function render (entry, action, icon) {
  return {
    icon,
    title: entry,
    subtitle: entry,
    onSelect: (event) => {
      exec(action);
    }
  };
}

function filterFiles (files, query) {
  const re = globToRegExp(`*${query}*`);
  return files.filter( file => re.test(file) );
}

function search (baseDir, query, callback) {
  const options = { cwd : baseDir, nocase: true, debug: false, matchBase: true};
  const globStr = `*.gpg`;
  glob(globStr, options, (err, files) => {
    if ( err ) {
      return callback(err);
    } else {
      return callback(null, filterFiles(files, query));
    }
  });
}

module.exports = {
  parse,
  search,
  render
};
