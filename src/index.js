'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const regex = require('./regex');

let passwordStoreDir = process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

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
        const match = regex.entryMatcher(filePath, passwordStoreDir, searchStr);
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
  const match = regex.commandMatcher(term);
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
};
