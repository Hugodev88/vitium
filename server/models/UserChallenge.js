const mongoose = require('mongoose');

const UserChallengeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
    challenge: {
        type: mongoose.Types.ObjectId,
        ref: 'Challenge',
        required: [true, 'Please provide challenge'],
    },
    // Array de datas para registrar os dias em que o usuário marcou o desafio como completo
    // Cada entrada representa um dia de progresso.
    progress: {
        type: [Date],
        default: [],
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('UserChallenge', UserChallengeSchema);