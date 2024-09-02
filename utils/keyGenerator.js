
function generateRandomKey() {
  const randomString = Math.random().toString(36).substr(2, 6);
  return randomString;
}

const keyGenerator = {
  generateRandomKey
};

module.exports = keyGenerator;
