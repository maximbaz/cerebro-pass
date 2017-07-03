"use strict";

const plugin = require("./plugin");
const icon = require("./icon.png");

let passwordStoreDir =
  process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

const handler = ({ term, display, actions }) => {
  const parsed = plugin.parse(term);
  if (parsed) {
    if (parsed.action === "pass") {
      plugin.search(passwordStoreDir, parsed.query, (err, files) => {
        if (!err) {
          const results = files.map(file => {
            const entry = file.substring(0, file.length - 4);
            const action = `pass -c "${entry}"`;
            return plugin.render(entry, action, icon);
          });
          display(results);
        }
      });
    } else if (parsed.action === "passgen") {
      const action = parsed.query.length > 1
        ? `pass generate -c "${parsed.query}"`
        : "";

      display([plugin.render(`Generate ${parsed.query}...`, action, icon)]);
    }
  }
};

module.exports = {
  fn: handler
};
