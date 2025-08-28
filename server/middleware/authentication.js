const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret');
    // Attach the user to the job routes
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      throw new UnauthenticatedError('User not found');
    }
    req.user = { userId: user._id, email: user.email, name: user.name };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthenticatedError('Authentication invalid');
    }
    throw error; // Re-throw other errors
  }
};

module.exports = auth;