import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// 좋아요 상태를 가져오는 thunk
export const fetchLikeStatus = createAsyncThunk(
  "likes/fetchLikeStatus",
  async ({ cocktailId, userId, type }) => {
    const response = await api.get(
      `/likes?cocktailId=${cocktailId}&userId=${userId}&type=${type}`
    );
    return response.data;
  }
);

// 좋아요 상태를 토글하는 thunk
export const toggleLikeStatus = createAsyncThunk(
  "likes/toggleLikeStatus",
  async ({ cocktailId, userId, type, liked }) => {
    const response = await api.post("/likes", {
      cocktailId,
      userId,
      type,
      liked,
    });
    return response.data;
  }
);

const likeSlice = createSlice({
  name: "likes",
  initialState: {
    liked: false,
    likeCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikeStatus.fulfilled, (state, action) => {
        state.liked = action.payload.liked;
        state.likeCount = action.payload.likeCount;
      })
      .addCase(toggleLikeStatus.fulfilled, (state, action) => {
        state.liked = action.payload.liked;
        state.likeCount = action.payload.likeCount;
      });
  },
});

export default likeSlice.reducer;
