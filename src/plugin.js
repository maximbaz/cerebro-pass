'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const glob = require('glob');
const globToRegExp = require('glob-to-regexp');


function parse (term, callback) {
  const match = term.match(/^pass\s+(.+)/);
  if (match) {
    const query = match[1];
    callback(query);
  }
}

function render (file, icon) {
  const entry = file.substring(0,file.length - 4);
  return {
    icon,
    title: entry,
    subtitle: entry,
    onSelect: (event) => {
      exec(`pass -c "${entry}"`);
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
