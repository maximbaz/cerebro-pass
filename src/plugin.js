"use strict";

const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;
const glob = require("glob");
const globToRegExp = require("glob-to-regexp");

const AVAILABLE_ACTIONS = ["pass", "passgen", "otp", "otpadd"];

function parse(term) {
  const match = term.match(/^([^\s]+)\s+(.+)?$/);
  if (!match) {
    return null;
  }

  const action = match[1];
  const query = match[2] || "";
  if (!AVAILABLE_ACTIONS.includes(action)) {
    return null;
  }

  return { action, query };
}

function render(title, subtitle, action, icon) {
  return {
    icon,
    title: title,
    subtitle: subtitle,
    onSelect: event => {
      exec(action);
    }
  };
}

function filterFiles(files, query) {
  const globQuery = `*${query.replace(/\s+/g, "*")}*`;
  const re = globToRegExp(globQuery);
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
