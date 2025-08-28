require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');

// Routers
const authRouter = require('./routes/auth');
const habitsRouter = require('./routes/habits');
const progressRouter = require('./routes/progress');
const achievementsRouter = require('./routes/achievements');
const challengesRouter = require('./routes/challenges');

// Middleware
const authenticateUser = require('./middleware/authentication');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/habits', authenticateUser, habitsRouter);
app.use('/api/v1/progress', authenticateUser, progressRouter);
app.use('/api/v1/achievements', achievementsRouter);

// Error Handler Middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
