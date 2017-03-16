const assert = require('assert');

const regex = require('../src/regex');

describe('Regex', function() {
  describe('Escape', function() {
    it('should return \/ when the\'s a /', function() {
      assert.equal('\\/', regex.escape('/'));
    });

    it('should return \. when the\'s a .', function() {
      assert.equal('\\.', regex.escape('.'));
    });
  });

  describe('Entry Matcher', function() {
    const passwordStoreDir = '/home/user/.password-store';

    it('should match /home/user/.password-store/server/Freenode.gpg for "free"', function() {
      const match = regex.entryMatcher('/home/user/.password-store/server/Freenode.gpg', passwordStoreDir, 'free');
      assert(match);
      assert.equal('server/Freenode', match[1]);
    });

    it('should match /home/user/.password-store/server/Freenode.gpg for ""', function() {
      const match = regex.entryMatcher('/home/user/.password-store/server/Freenode.gpg', passwordStoreDir, '');
      assert(match);
      assert.equal('server/Freenode', match[1]);
    });

    it('should not match /home/user/.password-store/.gpg-id', function() {
      const match = regex.entryMatcher('/home/user/.password-store/.gpg-id', passwordStoreDir, 'free');
      assert(!match);
    });
  });

  describe('Command Matcher', function() {
    it('should not match "something else"', function() {
      const match = regex.commandMatcher('something else');
      assert(!match);
    });

    it('should match "pass query"', function() {
      const match = regex.commandMatcher('pass query');
      assert(match);
      assert.equal('query', match[1]);
    });

    it('should match "pass      query"', function() {
      const match = regex.commandMatcher('pass query');
      assert(match);
      assert.equal('query', match[1]);
    });
  });
});
