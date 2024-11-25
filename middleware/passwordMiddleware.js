const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../models/userModel');

async function verifyPassword(req, res, next) {
  const { email, password } = req.body;
  const user = (await getUserByEmail(email))[0];
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Password verification failed.' });

  req.user = user;
  next();
}

module.exports = { verifyPassword };
