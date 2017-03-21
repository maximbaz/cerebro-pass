'use strict';

const assert = require('assert');
const cwd = require('cwd');

const plugin = require('../src/plugin');

describe('Plugin', () => {
  // Parse ---------------------------------------------
  describe('parse', () =>{
    function assertParse (string, expected, done) {
      plugin.parse(string, (query) => {
        assert.equal(expected, query);
        done();
      });
    }

    it('should parse "pass query"', (done) => {
      assertParse('pass query', 'query', done);
    });

    it('should parse "pass       query"', (done) => {
      assertParse('pass              query', 'query', done);
    });

    it('should parse "pass p*git"', (done) => {
      assertParse('pass p*git', 'p*git', done);
    });
  });

  // Search ---------------------------------------------
  describe('search', () => {
    function assertFound (expected, pattern, done) {
      plugin.search(cwd('test/files'), pattern, (err, files) => {
        if (err) {
          console.log('error: ' + error);
          done(err);
        }
        assert.equal(expected.length, files.length);
        expected.forEach( (exp,i) => assert.equal(exp, files[i]));
        done();
      });
    }

    it('should match whats', (done) => {
      assertFound( ['personal/whatsapp.gpg'], 'whats', done );
    });

    it('should match p*git', (done) => {
      assertFound( ['personal/github/personal_login.gpg'], 'p*git', done );
    });
  });

  // Search ---------------------------------------------
  describe('render', () => {
    it('should remove extension', () => {
      const rendered = plugin.render('personal/github/personal_login.gpg');
      assert.equal('personal/github/personal_login', rendered.title);
      assert.equal('personal/github/personal_login', rendered.subtitle);
    });
  });
});
