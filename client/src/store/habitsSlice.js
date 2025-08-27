import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { toast } from 'react-toastify';

// Async Thunks
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/habits');
      return response.data;
    } catch (error) {
      toast.error(error.response.data.msg || 'Failed to fetch habits');
      return rejectWithValue(error.response.data);
    }
  }
);

export const createHabit = createAsyncThunk(
  'habits/createHabit',
  async (habitData, { rejectWithValue }) => {
    try {
      const response = await api.post('/habits', habitData);
      toast.success('Habit created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response.data.msg || 'Failed to create habit');
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (habitId, { rejectWithValue }) => {
    try {
      await api.delete(`/habits/${habitId}`);
      toast.success('Habit deleted successfully!');
      return habitId;
    } catch (error) {
      toast.error(error.response.data.msg || 'Failed to delete habit');
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleHabit = createAsyncThunk(
  'habits/toggleHabit',
  async (habitId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/habits/${habitId}`);
      toast.success('Habit updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response.data.msg || 'Failed to update habit');
      return rejectWithValue(error.response.data);
    }
  }
);

const habitsSlice = createSlice({
  name: 'habits',
  initialState: {
    habits: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload.habits;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || 'Failed to fetch habits';
      })
      .addCase(createHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.loading = false;
        state.habits.push(action.payload.habit);
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || 'Failed to create habit';
      })
      .addCase(deleteHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = state.habits.filter(habit => habit._id !== action.payload);
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || 'Failed to delete habit';
      })
      .addCase(toggleHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleHabit.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = state.habits.map(habit =>
          habit._id === action.payload.habit._id ? action.payload.habit : habit
        );
      })
      .addCase(toggleHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || 'Failed to toggle habit';
      });
  },
});

export default habitsSlice.reducer;
