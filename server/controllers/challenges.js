const Challenge = require('../models/Challenge');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllChallenges = async (req, res) => {
  const challenges = await Challenge.find({ startDate: { $lte: new Date() } }).populate(
    'participants.userId',
    'name'
  );
  res.status(StatusCodes.OK).json({ challenges, count: challenges.length });
};

const getUpcomingChallenges = async (req, res) => {
  const challenges = await Challenge.find({ startDate: { $gt: new Date() } }).populate(
    'participants.userId',
    'name'
  );
  res.status(StatusCodes.OK).json({ challenges, count: challenges.length });
};

const getSingleChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const challenge = await Challenge.findById(challengeId).populate('participants.userId', 'name');
  if (!challenge) {
    throw new NotFoundError(`No challenge with id ${challengeId}`);
  }
  res.status(StatusCodes.OK).json({ challenge });
};

const updateChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const challenge = await Challenge.findByIdAndUpdate(challengeId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!challenge) {
    throw new NotFoundError(`No challenge with id ${challengeId}`);
  }
  res.status(StatusCodes.OK).json({ challenge });
};

const deleteChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const challenge = await Challenge.findByIdAndRemove(challengeId);
  if (!challenge) {
    throw new NotFoundError(`No challenge with id ${challengeId}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Challenge removed.' });
};

const joinChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const userId = req.user.userId;

  // Tenta adicionar apenas se o usuário não existir
  const challenge = await Challenge.findOneAndUpdate(
    { _id: challengeId, 'participants.userId': { $ne: userId } }, // só atualiza se userId não estiver
    { $push: { participants: { userId } } }, // adiciona
    { new: true }
  ).populate('participants.userId', 'name');

  if (!challenge) {
    // Se não encontrou, ou não existe o desafio, ou já tinha o usuário
    throw new BadRequestError('You have already joined this challenge or challenge does not exist');
  }

  res.status(StatusCodes.OK).json({ msg: 'Joined challenge successfully', challenge });
};


const leaveChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  const userId = req.user.userId;

  const challenge = await Challenge.findByIdAndUpdate(
    challengeId,
    { $pull: { participants: { userId } } }, // remove direto no banco
    { new: true }
  ).populate('participants.userId', 'name');

  if (!challenge) {
    throw new NotFoundError(`No challenge with id ${challengeId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Left challenge successfully', challenge });
};

module.exports = {
  getAllChallenges,
  getUpcomingChallenges,
  getSingleChallenge,
  updateChallenge,
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
};
