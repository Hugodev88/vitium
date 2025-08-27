const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [50, 'name can not be more than 50 characters'],
  },
  type: {
    type: String,
    enum: ['good', 'bad'],
    required: [true, 'must provide type'],
  },
  records: {
    type: [Date],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
