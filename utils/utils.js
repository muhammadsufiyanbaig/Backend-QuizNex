// utils/keyGenerators.js

const keyGenerator = (function () {
  function generateRandomKey() {
    const randomString = Math.random().toString(36).substr(2, 6);
    return `${randomString}`;
  }

  return {
    generateRandomKey
  };
})();

module.exports = keyGenerator;
