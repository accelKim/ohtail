import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "../store/ref";

export const fetchLikeStatus = createAsyncThunk(
  "webzineLikes/fetchLikeStatus",
  async ({ webzineId, userId }) => {
    const response = await fetch(
      `${url}/webzineLike?webzineId=${webzineId}&userId=${userId}`
    );
    const data = await response.json();
    return data;
  }
);

export const toggleLikeStatus = createAsyncThunk(
  "webzineLikes/toggleLikeStatus",
  async ({ webzineId, userId, liked }) => {
    const response = await fetch(`${url}/webzineLike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ webzineId, userId, liked }),
    });
    const data = await response.json();
    return data;
  }
);

const webzineLikeSlice = createSlice({
  name: "webzineLikes",
  initialState: {
    liked: false,
    likeCount: 0,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLikeStatus.fulfilled, (state, action) => {
      state.liked = action.payload.liked;
      state.likeCount = action.payload.likeCount;
    });
    builder.addCase(toggleLikeStatus.fulfilled, (state, action) => {
      state.liked = action.payload.liked;
      state.likeCount = action.payload.likeCount;
    });
  },
});

export default webzineLikeSlice.reducer;
