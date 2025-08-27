const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const { StatusCodes } = require('http-status-codes'); // Import StatusCodes

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { name: 'AuthenticationError', message: 'Authentication invalid', statusCode: StatusCodes.UNAUTHORIZED };
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret');
    // Attach the user to the job routes
    const user = await User.findById(payload.userId).select('-password'); // Fetch user from DB
    if (!user) {
      throw { name: 'AuthenticationError', message: 'User not found', statusCode: StatusCodes.UNAUTHORIZED }; // Throw custom error
    }
    req.user = { userId: user._id, email: user.email, name: user.name }; // Include name
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw { name: 'AuthenticationError', message: 'Authentication invalid', statusCode: StatusCodes.UNAUTHORIZED };
    }
    throw error; // Re-throw other errors
  }
};

module.exports = auth;

