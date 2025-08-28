const Challenge = require('../models/Challenge');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllChallenges = async (req, res) => {
  const challenges = await Challenge.find({});
  res.status(StatusCodes.OK).json({ challenges, count: challenges.length });
};

const getSingleChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new NotFoundError(`No challenge with id ${challengeId}`);
  }
  res.status(StatusCodes.OK).json({ challenge });
};

const createChallenge = async (req, res) => {
  const challenge = await Challenge.create(req.body);
  res.status(StatusCodes.CREATED).json({ challenge });
};

const joinChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const userId = req.user.userId;

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new NotFoundError(`No challenge with id ${challengeId}`);
  }

  // Check if user already joined
  const alreadyJoined = challenge.participants.some(
    (p) => p.userId.toString() === userId
  );

  if (alreadyJoined) {
    return res.status(StatusCodes.OK).json({ msg: 'Already joined this challenge' });
  }

  challenge.participants.push({ userId });
  await challenge.save();

  res.status(StatusCodes.OK).json({ msg: 'Joined challenge successfully', challenge });
};

const leaveChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const userId = req.user.userId;

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new NotFoundError(`No challenge with id ${challengeId}`);
  }

  const initialParticipantsCount = challenge.participants.length;
  challenge.participants = challenge.participants.filter(
    (p) => p.userId.toString() !== userId
  );

  if (challenge.participants.length === initialParticipantsCount) {
    return res.status(StatusCodes.OK).json({ msg: 'Not a participant of this challenge' });
  }

  await challenge.save();

  res.status(StatusCodes.OK).json({ msg: 'Left challenge successfully', challenge });
};

module.exports = {
  getAllChallenges,
  getSingleChallenge,
  createChallenge,
  joinChallenge,
  leaveChallenge,
};
