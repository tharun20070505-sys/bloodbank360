const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodBank = require('../models/BloodBank');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bloodconnect_secret_key_2026_super_secure', {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, additionalData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'PATIENT'
    });

    // Create role-specific profile document
    if (user.role === 'DONOR') {
      const { bloodGroup, coordinates, address, city, preferredRadius, lastDonationDate } = additionalData || {};
      await Donor.create({
        userId: user._id,
        bloodGroup: bloodGroup || 'O+',
        location: {
          type: 'Point',
          coordinates: coordinates || [76.9558, 11.0168] // default [lng, lat]
        },
        address: address || 'Local Area',
        city: city || 'Coimbatore',
        preferredRadius: preferredRadius || 15,
        lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
        available: true
      });
    } else if (user.role === 'BLOOD_BANK') {
      const { name: bankName, registrationNumber, address, city, coordinates, phone: bankPhone } = additionalData || {};
      await BloodBank.create({
        userId: user._id,
        name: bankName || `${user.name} Blood Center`,
        registrationNumber: registrationNumber || `REG-${Date.now().toString().slice(-6)}`,
        address: address || 'Main Healthcare Avenue',
        city: city || 'Coimbatore',
        location: {
          type: 'Point',
          coordinates: coordinates || [76.9600, 11.0200]
        },
        phone: bankPhone || user.phone || '0422-223344',
        email: user.email,
        verified: false // Admin must verify
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact administrator.' });
    }

    const token = generateToken(user._id);

    // Fetch linked profile if any
    let linkedProfile = null;
    if (user.role === 'DONOR') {
      linkedProfile = await Donor.findOne({ userId: user._id });
    } else if (user.role === 'BLOOD_BANK') {
      linkedProfile = await BloodBank.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: linkedProfile
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let linkedProfile = null;

    if (user.role === 'DONOR') {
      linkedProfile = await Donor.findOne({ userId: user._id });
    } else if (user.role === 'BLOOD_BANK') {
      linkedProfile = await BloodBank.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: linkedProfile
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};
