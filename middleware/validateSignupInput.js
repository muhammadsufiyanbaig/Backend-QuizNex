function validateSignupInput(req, res, next) {
  const { name, email, username, password, phoneNumber, type } = req.body;
  console.log('=== Signup Input Fields ===');
  console.log('Body:', req.body);
  console.log('Name:', req.body.name);
  console.log('Username:', req.body.username);
  console.log('Email:', req.body.email);
  console.log('Password:', req.body.password);
  console.log('Phone Number:', req.body.phoneNumber);
  console.log('Type:', req.body.type);
  console.log('========================');
  if (!name || !email || !username || !password || !phoneNumber || !type) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  next();
}

module.exports = { validateSignupInput };
