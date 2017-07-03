"use strict";

const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;
const glob = require("glob");
const globToRegExp = require("glob-to-regexp");

const AVAILABLE_ACTIONS = ["pass", "passgen"];

function parse(term) {
  const match = term.match(/^([^\s]+)\s+(.+)$/);
  if (!match) {
    return null;
  }

  const [_, action, query] = match;
  if (!AVAILABLE_ACTIONS.includes(action)) {
    return null;
  }

  return { action, query };
}

function render(entry, action, icon) {
  return {
    icon,
    title: entry,
    subtitle: entry,
    onSelect: event => {
      exec(action);
    }
  };
}

function filterFiles(files, query) {
  const re = globToRegExp(`*${query}*`);
  return files.filter(file => re.test(file));
}

function search(baseDir, query, callback) {
  const options = { cwd: baseDir, nocase: true, debug: false, matchBase: true };
  const globStr = `*.gpg`;
  glob(globStr, options, (err, files) => {
    if (err) {
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
