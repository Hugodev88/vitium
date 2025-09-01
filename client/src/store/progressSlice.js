import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../services/api';

export const fetchProgress = createAsyncThunk(
  'progress/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/progress');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || error.message);
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    progress: {
      totalHabits: 0,
      goodHabitsCompleted: 0,
      badHabitsAvoided: 0,
    },
    habits: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload.overallProgress || {
          totalHabits: 0,
          goodHabitsCompleted: 0,
          badHabitsAvoided: 0,
        };
        state.habits = action.payload.habitsData || [];
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default progressSlice.reducer;
