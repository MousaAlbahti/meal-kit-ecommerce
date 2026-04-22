import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')):null ,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUserLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user',JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
            localStorage.removeItem('user');

    },
  },
});

export const { saveUserLogin, logout } = authSlice.actions;
export default authSlice.reducer;