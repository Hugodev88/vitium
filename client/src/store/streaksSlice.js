import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../services/api';

export const fetchStreaks = createAsyncThunk(
  'streaks/fetchStreaks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/progress'); // Fetch from /progress
      return response.data.streaks; // Extract streaks from the response
    } catch (error) {
      return rejectWithValue(error.response.data.msg || error.message);
    }
  }
);

const streaksSlice = createSlice({
  name: 'streaks',
  initialState: {
    progress: null, // For streaks data
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreaks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStreaks.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(fetchStreaks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default streaksSlice.reducer;
