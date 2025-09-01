const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email and password');
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
};

// GET CURRENT USER (precisa de middleware de auth para req.user)
const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

module.exports = { register, login, getCurrentUser };
