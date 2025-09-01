const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [emailRegex, 'Please provide a valid email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  unlockedAchievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
    },
  ],
});

// Hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // só hashear se for novo ou alterado
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Gerar JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET || 'jwtsecret',
    { expiresIn: '30d' }
  );
};

// Comparar senha digitada com hash no banco
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
