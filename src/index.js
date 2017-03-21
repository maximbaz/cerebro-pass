'use strict';

const plugin = require('./plugin');
const icon = require('./icon.png');

let passwordStoreDir = process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

const handler = ({term, display, actions}) => {
  plugin.parse(term, (query) => {
    plugin.search(passwordStoreDir, query, (err, files) => {
      const results = files.map(file => plugin.render(file, icon));
      display(results);
    });
  });
};

module.exports = {
  fn: handler
};
