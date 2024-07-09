import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance"; // axios 인스턴스를 가져옵니다

export const fetchLikeStatus = createAsyncThunk(
  "likes/fetchLikeStatus",
  async ({ cocktailId, userId, type }) => {
    const response = await api.get(
      `/api/likes?cocktailId=${cocktailId}&userId=${userId}&type=${type}`
    );
    return response.data;
  }
);

export const toggleLikeStatus = createAsyncThunk(
  "likes/toggleLikeStatus",
  async ({ cocktailId, userId, type, liked }) => {
    const response = await api.post("api/likes", {
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
