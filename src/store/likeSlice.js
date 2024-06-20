// likesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLikeStatus = createAsyncThunk(
  'likes/fetchLikeStatus',
  async ({ cocktailId, userId }) => {
    const response = await axios.get(`http://localhost:8080/likes?cocktailId=${cocktailId}&userId=${userId}`);
    return response.data.liked;
  }
);

export const toggleLikeStatus = createAsyncThunk(
  'likes/toggleLikeStatus',
  async ({ cocktailId, userId, liked }) => {
    await axios.post('http://localhost:8080/likes', { cocktailId, userId, liked });
    return liked;
  }
);

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    liked: false,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikeStatus.fulfilled, (state, action) => {
        state.liked = action.payload;
      })
      .addCase(toggleLikeStatus.fulfilled, (state, action) => {
        state.liked = action.payload;
      });
  },
});

export default likesSlice.reducer;
