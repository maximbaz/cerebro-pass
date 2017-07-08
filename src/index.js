"use strict";

const plugin = require("./plugin");
const icon = require("./icon.png");

let passwordStoreDir =
  process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

const usedEntries = {};

const handler = ({ term, display, actions }) => {
  const parsed = plugin.parse(term);
  if (!parsed) {
    return;
  }

  switch (parsed.action) {
    case "pass":
      searchDisplay(
        "password",
        display,
        parsed.query.trim(),
        entry => `pass show -c ${entry}`
      );
      break;

    case "otp":
      searchDisplay(
        "code",
        display,
        parsed.query.trim(),
        entry => `pass otp -c ${entry}`
      );
      break;

    case "passgen":
      display([
        plugin.render(
          icon,
          `Generate password for: ${parsed.query.trim()}`,
          "(will save the password and put it to clipboard)",
          prepareEntryAction(
            parsed.query.trim(),
            entry => `pass generate -c "${entry}"`
          )
        )
      ]);
      break;

    case "otpadd": {
      const splitIndex = parsed.query.indexOf(" ");
      if (splitIndex === -1) {
        display([
          plugin.render(
            icon,
            `Paste OTP secret key: ${parsed.query}`,
            "(remove spaces if any)",
            () => undefined
          )
        ]);
        break;
      }

      const secret = parsed.query.substr(0, splitIndex);
      const path = parsed.query.substr(splitIndex + 1);
      const otpauthUri = `otpauth://totp/totp-secret?secret=${secret}&issuer=totp-secret`;
      const action = entry =>
        `echo '${otpauthUri}' | pass otp append '${entry}'; pass otp -c '${entry}'`;
      searchDisplay("confirmation code", display, path, action);
      break;
    }
  }
};

const searchDisplay = (target, display, path, action) => {
  plugin.search(passwordStoreDir, path, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const results = files
      .map(file => file.substring(0, file.length - 4))
      .sort((a, b) => (usedEntries[b] || 0) - (usedEntries[a] || 0))
      .map(entry => {
        return plugin.render(
          icon,
          entry,
          `(will copy ${target} to clipboard)`,
          prepareEntryAction(entry, action)
        );
      });

    display(results);
  });
};

const prepareEntryAction = (entry, action) => {
  return () => {
    usedEntries[entry] = (usedEntries[entry] || 0) + 1;
    return action(entry);
  };
};

module.exports = {
  fn: handler
};
