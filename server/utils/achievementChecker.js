const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Habit = require('../models/Habit');

// Helper function to calculate streak for a single habit
const calculateStreak = (records) => {
  if (records.length === 0) {
    return 0;
  }

  // Sort records in ascending order
  const sortedRecords = records.map(date => new Date(date)).sort((a, b) => a - b);

  let currentStreak = 0;
  let lastDate = null;

  for (let i = sortedRecords.length - 1; i >= 0; i--) {
    const currentDate = sortedRecords[i];
    currentDate.setHours(0, 0, 0, 0);

    if (lastDate === null) {
      // Check if the most recent record is today or yesterday
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (currentDate.getTime() === today.getTime()) {
        currentStreak = 1;
        lastDate = currentDate;
      } else if (currentDate.getTime() === yesterday.getTime()) {
        currentStreak = 1;
        lastDate = currentDate;
      } else {
        break; // No current streak if not today or yesterday
      }
    } else {
      const previousDay = new Date(lastDate);
      previousDay.setDate(lastDate.getDate() - 1);

      if (currentDate.getTime() === previousDay.getTime()) {
        currentStreak++;
        lastDate = currentDate;
      } else if (currentDate.getTime() < previousDay.getTime()) {
        // If there's a gap, break the streak
        break;
      }
      // If currentDate is same as lastDate, it's a duplicate entry, continue
    }
  }
  return currentStreak;
};

const checkAndUnlockAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    const allAchievements = await Achievement.find({});
    const userHabits = await Habit.find({ userId: userId });

    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (user.unlockedAchievements.includes(achievement._id)) {
        continue;
      }

      let unlocked = false;
      const criteria = achievement.criteria;

      switch (criteria.type) {
        case 'streak':
          // Criteria: { type: 'streak', value: 10, habitType: 'any' }
          // habitType can be 'good', 'bad', or 'any'
          const targetStreak = criteria.value;
          const requiredHabitType = criteria.habitType || 'any';

          for (const habit of userHabits) {
            if (requiredHabitType !== 'any' && habit.type !== requiredHabitType) {
              continue;
            }
            const streak = calculateStreak(habit.records);
            if (streak >= targetStreak) {
              unlocked = true;
              break;
            }
          }
          break;
        // Add more achievement types here (e.g., 'totalHabits', 'specificHabitCompletion')
        case 'totalHabits':
            // Criteria: { type: 'totalHabits', value: 5 }
            if (userHabits.length >= criteria.value) {
                unlocked = true;
            }
            break;
        default:
          console.warn(`Unknown achievement criteria type: ${criteria.type}`);
          break;
      }

      if (unlocked) {
        user.unlockedAchievements.push(achievement._id);
        await user.save();
        console.log(`Achievement unlocked for user ${user.name}: ${achievement.name}`);
        // Potentially emit an event or send a notification here
      }
    }
  } catch (error) {
    console.error('Error checking and unlocking achievements:', error);
  }
};

module.exports = { checkAndUnlockAchievements, calculateStreak };
