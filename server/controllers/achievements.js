const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllAchievements = async (req, res) => {
  const achievements = await Achievement.find({});
  const user = await User.findById(req.user.userId).select('unlockedAchievements');

  const achievementsWithStatus = achievements.map(achievement => ({
    ...achievement.toObject(),
    unlocked: user.unlockedAchievements.includes(achievement._id),
  }));

  res.status(StatusCodes.OK).json({ achievements: achievementsWithStatus, count: achievements.length });
};

const unlockAchievement = async (req, res) => {
  const { achievementId } = req.body;
  const userId = req.user.userId;

  if (!achievementId) {
    throw new BadRequestError('Please provide achievement ID');
  }

  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    throw new NotFoundError(`No achievement with id ${achievementId}`);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }

  if (user.unlockedAchievements.includes(achievementId)) {
    return res.status(StatusCodes.OK).json({ msg: 'Achievement already unlocked' });
  }

  user.unlockedAchievements.push(achievementId);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Achievement unlocked successfully', achievement });
};

module.exports = {
  getAllAchievements,
  unlockAchievement,
};
