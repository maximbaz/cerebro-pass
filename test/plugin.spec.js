"use strict";

const assert = require("assert");
const cwd = require("cwd");
const plugin = require("../src/plugin");

describe("Plugin", () => {
  // Parse ---------------------------------------------
  describe("parse", () => {
    for (let action of ["pass", "passgen", "otp", "otpadd"]) {
      it(`should parse "${action}" action`, () => {
        assert.equal(action, plugin.parse(`${action} query`).action);
      });
    }

    it("should not parse unknown action", () => {
      assert.equal(null, plugin.parse("passbla query"));
    });

    it("should parse query", () => {
      assert.equal("one two three", plugin.parse("pass one two three").query);
    });

    it("should ignore initial spaces when parsing query", () => {
      assert.equal(
        "one two three   ",
        plugin.parse("pass    one two three   ").query
      );
    });
  });

  // Search ---------------------------------------------
  describe("search", () => {
    function assertFound(expected, pattern, done) {
      plugin.search(cwd("test/files"), pattern, (err, files) => {
        if (err) {
          done(err);
        }
        assert.equal(expected.length, files.length);
        expected.forEach((exp, i) => assert.equal(exp, files[i]));
        done();
      });
    }

    it("should match whats", done => {
      assertFound(["personal/whatsapp.gpg"], "whats", done);
    });

    it("should match p*git", done => {
      assertFound(["personal/github/personal_login.gpg"], "p*git", done);
    });

    it("should match p git", done => {
      assertFound(["personal/github/personal_login.gpg"], "p git", done);
    });
  });

  // Render ---------------------------------------------
  describe("render", () => {
    it("should remove extension", () => {
      const file = "personal/github/personal_login.gpg";
      const entry = file.substring(0, file.length - 4);
      const action = `pass show -c "${entry}"`;
      const rendered = plugin.render(
        entry,
        "(will copy password to clipboard)",
        action
      );

      assert.equal("personal/github/personal_login", rendered.title);
      assert.equal("(will copy password to clipboard)", rendered.subtitle);
    });
  });
});
