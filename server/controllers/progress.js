const Habit = require('../models/Habit');
const { StatusCodes } = require('http-status-codes');

const getProgress = async (req, res) => {
  const { userId } = req.user;
  const habits = await Habit.find({ userId });

  const totalHabits = habits.length;
  const goodHabits = habits.filter(h => h.type === 'good');
  const badHabits = habits.filter(h => h.type === 'bad');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date) => {
    const recordDate = new Date(date);
    return recordDate >= today;
  };

  const goodHabitsCompleted = goodHabits.filter(habit => habit.records.some(record => isToday(record))).length;
  const badHabitsAvoided = badHabits.filter(habit => habit.records.some(record => isToday(record))).length;

  const calculateStreak = (records) => {
    if (records.length === 0) return 0;
    let streak = 0;
    const sortedRecords = records.map(r => new Date(r)).sort((a, b) => b - a);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = today;

    for (let i = 0; i < sortedRecords.length; i++) {
      const recordDate = new Date(sortedRecords[i]);
      recordDate.setHours(0, 0, 0, 0);

      if (recordDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streaks = habits.map(habit => ({
    habitId: habit._id,
    name: habit.name,
    streak: calculateStreak(habit.records),
  }));

  res.status(StatusCodes.OK).json({
    totalHabits,
    goodHabitsCompleted,
    badHabitsAvoided,
    streaks,
    habitsData: habits,
  });
};

module.exports = { getProgress };
