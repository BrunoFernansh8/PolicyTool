const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Company = require('../models/Company');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate name format (only letters allowed)
const isValidName = (name) => {
  const nameRegex = /^[A-Za-z]+$/;
  return nameRegex.test(name);
};

// Register SuperUser
exports.registerSuperUser = async (req, res) => {
  const { name, email, password, postcode, companyName } = req.body;
  const companyNameToUse = companyName || (req.body.company && req.body.company.name);

  // Validate required fields
  if (!name || !email || !password || !companyNameToUse) {
    return res.status(400).json({ errors: 'Missing required fields' });
  }

  // Validate email and name format
  if (!isValidEmail(email)) {
    return res.status(400).json({ errors: 'Invalid email format (e.g valid email: hello@testing.com' });
  }
  if (!isValidName(name)) {
    return res.status(400).json({ errors: 'Invalid name format. Only letters are allowed (e.g Safian).' });
  }

  try {
    const organisationPassword = require('crypto').randomBytes(16).toString('hex');

    const company = new Company({ name: companyNameToUse, uniquePassword: organisationPassword });
    await company.save();

    const superuser = new User({
      name,
      email,
      password,
      postcode,
      role: 'superuser',
      company: company._id,
    });
    await superuser.save();

    company.superuser = superuser._id;
    await company.save();

    res.status(201).json({ 
      message: 'SuperUser registered successfully', 
      superuser: { email: superuser.email },
      organisationPassword 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering SuperUser. Credentials Invalid or Duplicate. View the database for more information.' });
  }
};

// Register Normal User
exports.registerUser = async (req, res) => {
  const { name, email, password, postcode, organisationPassword } = req.body;

  // Validate required fields
  if (!name || !email || !password || !postcode || !organisationPassword) {
    return res.status(400).json({ errors: 'Missing required fields' });
  }

  // Validate email and name format
  if (!isValidEmail(email)) {
    return res.status(400).json({ errors: 'Invalid email format' });
  }
  if (!isValidName(name)) {
    return res.status(400).json({ errors: 'Invalid name format. Only letters are allowed.' });
  }

  try {
    const company = await Company.findOne({ uniquePassword: organisationPassword });
    if (!company) {
      return res.status(400).json({ errors: 'Invalid organisation password' });
    }

    const user = new User({
      name,
      email,
      password,
      postcode,
      role: 'user',
      company: company._id,
    });
    await user.save();

    company.employees.push(user._id);
    await company.save();

    res.status(201).json({ message: 'User registered successfully', user: { email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};


// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};
