const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Company = require('../models/Company');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register SuperUser
exports.registerSuperUser = async (req, res) => {
  const { name, email, password, postcode, companyName } = req.body;
  // Allow companyName to come either as a top-level field or as part of a company object
  const companyNameToUse = companyName || (req.body.company && req.body.company.name);

  // Validate required fields without changing variable names
  if (!name || !email || !password || !companyNameToUse) {
    return res.status(400).json({ errors: 'Missing required fields' });
  }

  try {
    // Generate unique organisation password
    const organisationPassword = require('crypto').randomBytes(16).toString('hex');

    // Create company using the resolved company name
    const company = new Company({ name: companyNameToUse, uniquePassword: organisationPassword });
    await company.save();

    // Create SuperUser
    const superuser = new User({
      name,
      email,
      password,
      postcode,
      role: 'superuser',
      company: company._id,
    });
    await superuser.save();

    // Link company to SuperUser
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

  try {
    // Find company by organisation password
    const company = await Company.findOne({ uniquePassword: organisationPassword });
    if (!company) {
      return res.status(400).json({ errors: 'Invalid organisation password' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      postcode,
      role: 'user',
      company: company._id,
    });
    await user.save();

    // Add user to company
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
