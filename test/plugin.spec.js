"use strict";

const assert = require("assert");
const cwd = require("cwd");
const plugin = require("../src/plugin");

describe("Plugin", () => {
  // Parse ---------------------------------------------
  describe("parse", () => {
    it('should parse "pass query"', () => {
      assert.equal("query", plugin.parse("pass query").query);
    });

    it('should parse "otp query"', () => {
      assert.equal("query", plugin.parse("otp query").query);
    });

    it('should parse "pass       query"', () => {
      assert.equal("query", plugin.parse("pass        query").query);
    });

    it('should parse "pass p*git"', () => {
      assert.equal("p*git", plugin.parse("pass p*git").query);
    });

    it('should parse "pass p git"', () => {
      assert.equal("p git", plugin.parse("pass p git").query);
    });

    it('should parse "passgen test.com/abc"', () => {
      assert.equal("passgen", plugin.parse("passgen test.com/abc").action);
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
      const rendered = plugin.render(entry, action);

      assert.equal("personal/github/personal_login", rendered.title);
      assert.equal("personal/github/personal_login", rendered.subtitle);
    });
  });
});
