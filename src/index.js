'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

let passwordStoreDir = process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

const searchFiles = (dir, searchStr) => {
  let files = [];
  const allFilesSync = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);

      if (fs.statSync(filePath).isDirectory()) {
        // Directory, go into it
        allFilesSync(filePath);
      } else {
        // Regular file
        const reStr = `^${escapeRegExp(passwordStoreDir)}.(.*${escapeRegExp(searchStr)}.*)\.gpg`;
        const match = filePath.match(new RegExp(reStr ,'i'));
        if (match) {
          files.push(match[1]);
        }
      }
    });
  };

  allFilesSync(passwordStoreDir);
  return files;
};

const icon = require('./icon.png');

const plugin = ({term, display, actions}) => {
  const match = term.match(/^pass\s(\w+)/);
  if (match) {
    const query = match[1];
    let files = searchFiles(passwordStoreDir, query);
    const results = files.map(file => ({
      icon,
      title: file,
      subtitle: file,
      onSelect: (event) => {
        exec(`pass -c "${file}"`);
      }
    }));
    display(results);
  }
};

module.exports = {
  fn: plugin
}
