import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// 좋아요 상태를 가져오는 thunk
export const fetchLikeStatus = createAsyncThunk(
  'likes/fetchLikeStatus',
  async ({ recipeId }, { getState }) => {
    const state = getState();
    const token = state.auth.token; // Redux 상태에서 토큰을 가져옵니다.
    const response = await api.get(`/likes?recipeId=${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

// 좋아요 상태를 토글하는 thunk
export const toggleLikeStatus = createAsyncThunk(
  'likes/toggleLikeStatus',
  async ({ recipeId, liked }, { getState }) => {
    const state = getState();
    const token = state.auth.token; // Redux 상태에서 토큰을 가져옵니다.
    const response = liked
      ? await api.delete('/likes/remove', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { recipeId }, // 삭제 요청의 본문에 recipeId를 포함
        })
      : await api.post('/likes/add', { recipeId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    return response.data;
  }
);

const likeSlice = createSlice({
  name: 'likes',
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
