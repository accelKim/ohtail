import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "./likeSlice";
import commentsReducer from "./commentSlice";
import webzineReducer from "./webzineLikeSlice";
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    likes: likesReducer,
    auth: authReducer,
    comments: commentsReducer,
    webzineLikes: webzineReducer,
  },
});

export default store;
