import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
