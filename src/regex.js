
const escape = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

const entryMatcher = (file, passwordStoreDir, query) => {
  const reStr = `^${escape(passwordStoreDir)}.(.*${escape(query)}.*)\.gpg`;
  return file.match(new RegExp(reStr ,'i'));
};

const commandMatcher = (term) => {
  return term.match(/^pass\s+(\w+)/);
};

module.exports = {
  escape,
  entryMatcher,
  commandMatcher
};
