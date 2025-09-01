const UserChallenge = require('../models/UserChallenge');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const markChallengeDayComplete = async (req, res) => {
    const { userId } = req.user; // Obtido do middleware de autenticação
    const { challengeId } = req.params;

    if (!challengeId) {
        throw new BadRequestError('Please provide challenge ID');
    }

    // Verificar se o desafio existe
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
        throw new NotFoundError(`No challenge with id ${challengeId}`);
    }

    let userChallenge = await UserChallenge.findOne({ user: userId, challenge: challengeId });

    if (!userChallenge) {
        // Se não existir, cria um novo registro de progresso para o usuário neste desafio
        userChallenge = await UserChallenge.create({ user: userId, challenge: challengeId });
    }

    // Adiciona a data atual ao progresso, se ainda não foi adicionada para hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

    const alreadyCompletedToday = userChallenge.progress.some(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });

    if (alreadyCompletedToday) {
        return res.status(StatusCodes.OK).json({ msg: 'Day already marked as complete for today.', userChallenge });
    }

    userChallenge.progress.push(new Date());

    // Verifica se o desafio foi completado (30 dias)
    const requiredDays = 30; // Definir o número de dias para completar o desafio
    if (userChallenge.progress.length >= requiredDays && !userChallenge.isCompleted) {
        userChallenge.isCompleted = true;
        userChallenge.completedAt = new Date();

        // Conceder a insígnia ao usuário
        const user = await User.findById(userId);
        if (user && !user.badges.includes(challenge.name + ' Master')) { // Usar o nome do desafio como parte da insígnia
            user.badges.push(challenge.name + ' Master');
            await user.save();
        }
    }

    await userChallenge.save();

    res.status(StatusCodes.OK).json({ userChallenge });
};

const getUserChallengeProgress = async (req, res) => {
    const { userId } = req.user;
    const { challengeId } = req.params;

    if (!challengeId) {
        throw new BadRequestError('Please provide challenge ID');
    }

    const userChallenge = await UserChallenge.findOne({ user: userId, challenge: challengeId });

    if (!userChallenge) {
        return res.status(StatusCodes.OK).json({ progress: 0, isCompleted: false, completedAt: null });
    }

    res.status(StatusCodes.OK).json({
        progress: userChallenge.progress.length,
        isCompleted: userChallenge.isCompleted,
        completedAt: userChallenge.completedAt
    });
};

module.exports = {
    markChallengeDayComplete,
    getUserChallengeProgress,
};