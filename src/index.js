"use strict";

const plugin = require("./plugin");

let passwordStoreDir =
  process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

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
          `Generate password for: ${parsed.query.trim()}`,
          "(will save the password and put it to clipboard)",
          `pass generate -c "${parsed.query.trim()}"`
        )
      ]);
      break;

    case "otpadd": {
      const splitIndex = parsed.query.indexOf(" ");
      if (splitIndex === -1) {
        display([
          plugin.render(
            `Paste OTP secret key: ${parsed.query}`,
            "(remove spaces if any)"
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

    const results = files.map(file => {
      const entry = file.substring(0, file.length - 4);
      return plugin.render(
        entry,
        `(will copy ${target} to clipboard)`,
        action(entry)
      );
    });

    display(results);
  });
};

module.exports = {
  fn: handler
};
