import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../services/api';

export const createHabit = createAsyncThunk(
  'habitForm/createHabit',
  async (habitData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/habits', habitData);
      return response.data.habit;
    } catch (error) {
      return rejectWithValue(error.response.data.msg || error.message);
    }
  }
);

const habitFormSlice = createSlice({
  name: 'habitForm',
  initialState: {
    name: '',
    description: '',
    type: 'good',
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    resetForm: (state) => {
      state.name = '';
      state.description = '';
      state.type = 'good';
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createHabit.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        // Optionally reset form fields here or in component after success
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setName, setDescription, setType, resetForm } = habitFormSlice.actions;

export default habitFormSlice.reducer;
