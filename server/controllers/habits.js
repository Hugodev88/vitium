const Habit = require('../models/Habit');
const { StatusCodes } = require('http-status-codes');

const getAllHabits = async (req, res) => {
  const habits = await Habit.find({ userId: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ habits, count: habits.length });
};

const createHabit = async (req, res) => {
  req.body.userId = req.user.userId;
  const habit = await Habit.create(req.body);
  res.status(StatusCodes.CREATED).json({ habit });
};

const getHabit = async (req, res) => {
  const { user: { userId }, params: { id: habitId } } = req;
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) {
    throw new Error(`No habit with id ${habitId}`);
  }
  res.status(StatusCodes.OK).json({ habit });
};

const deleteHabit = async (req, res) => {
  const { user: { userId }, params: { id: habitId } } = req;
  const habit = await Habit.findOneAndDelete({ _id: habitId, userId });
  if (!habit) {
    throw new Error(`No habit with id ${habitId}`);
  }
  res.status(StatusCodes.OK).send();
};

const updateHabit = async (req, res) => {
  const { user: { userId }, params: { id: habitId } } = req;

  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) {
    throw new Error(`No habit with id ${habitId}`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = habit.records.map(date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  const todayTime = today.getTime();

  if (records.includes(todayTime)) {
    habit.records = habit.records.filter(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() !== todayTime;
    });
  } else {
    habit.records.push(today);
  }

  await habit.save();
  res.status(StatusCodes.OK).json({ habit });
};

module.exports = {
  getAllHabits,
  createHabit,
  getHabit,
  updateHabit,
  deleteHabit,
};
