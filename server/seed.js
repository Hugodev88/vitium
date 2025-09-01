require('dotenv').config();

const connectDB = require('./db/connect');
const Challenge = require('./models/Challenge');

const challenges = [
  {
    name: 'NoFap September',
    description: 'Abstenha-se de pornografia e masturbação durante todo o mês de setembro.',
    rules: {
      type: 'streak',
      habitName: 'NoFap',
      value: 30,
    },
    startDate: new Date('2025-09-01'),
    endDate: new Date('2025-10-01'),
  },
];

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Challenge.deleteMany();
    await Challenge.create(challenges);
    console.log('Success!!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();