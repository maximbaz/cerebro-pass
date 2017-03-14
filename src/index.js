'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

let passwordStoreDir = process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

const formatPath = (path) => {
  const start = passwordStoreDir.length + 1;
  const size = path.length - start - 4;
  return path.substr(start, size);
}

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
        if (file.indexOf(searchStr) > -1) {
          files.push(formatPath(filePath));
        }
      }
    });
  };

  allFilesSync(passwordStoreDir);
  return files;
};

const icon = require('./icon.png');

const plugin = ({term, display, actions}) => {
  console.log('term=' + term);
  const parts = term.split(' ');
  if ( parts.length > 1 && parts[0] === 'pass') {
    let files = searchFiles(passwordStoreDir, parts[1]);
    const results = files.map(file => ({
      icon,
      title: file,
      subtitle: file,
      onSelect: (event) => {
        exec('pass -c ' + file);
      }
    }));
    display(results);
  }
};

module.exports = {
  fn: plugin
}
