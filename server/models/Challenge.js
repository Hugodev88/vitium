const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide challenge name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide challenge description'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date'],
  },
  // Example: { type: 'streak', value: 30, habitName: 'NoFap' }
  // This could be more complex, e.g., an array of rules
  rules: {
    type: Object,
    required: [true, 'Please provide challenge rules'],
  },
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      // Could add progress tracking specific to the challenge here
      // e.g., currentStreak: Number, lastUpdate: Date
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Challenge', ChallengeSchema);
