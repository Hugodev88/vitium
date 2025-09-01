import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import habitsReducer from './habitsSlice';
import challengesReducer from './challengesSlice';
import achievementsReducer from './achievementsSlice';
import progressReducer from './progressSlice';
import streaksReducer from './streaksSlice';
import habitFormReducer from './habitFormSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer,
    challenges: challengesReducer,
    achievements: achievementsReducer,
    progress: progressReducer,
    streaks: streaksReducer,
    habitForm: habitFormReducer,
  },
});

export default store;
