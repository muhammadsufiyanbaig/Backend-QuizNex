function validateSignupInput(req, res, next) {
  const { fullName, email, username, password } = req.body;
  if (!fullName || !email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  next();
}

module.exports = { validateSignupInput };
