const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide achievement name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide achievement description'],
  },
  criteria: {
    type: Object,
    required: [true, 'Please provide achievement criteria'],
    // Example criteria: { type: 'streak', value: 10, habitType: 'any' }
    // { type: 'totalHabits', value: 5 }
  },
  icon: {
    type: String,
    default: 'default_achievement_icon.png',
  },
}, { timestamps: true });

module.exports = mongoose.model('Achievement', AchievementSchema);
