import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../services/api';

export const fetchChallenges = createAsyncThunk(
  'challenges/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/challenges');
      return response.data.challenges;
    } catch (error) {
      return rejectWithValue(error.response.data.msg || error.message);
    }
  }
);

const challengesSlice = createSlice({
  name: 'challenges',
  initialState: {
    challenges: [],
    seasonalChallenge: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload;
        
        // Logic to identify the seasonal challenge (active)
        const currentDate = new Date();
        const activeChallenge = action.payload.find(challenge => {
            const startDate = new Date(challenge.startDate);
            const endDate = new Date(challenge.endDate);
            endDate.setHours(23, 59, 59, 999); // Add 23 hours, 59 minutes, 59 seconds to endDate
            return currentDate >= startDate && currentDate <= endDate;
        });
        state.seasonalChallenge = activeChallenge;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default challengesSlice.reducer;
