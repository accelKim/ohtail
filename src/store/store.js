import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "./likeSlice";
import commentsReducer from "./commentSlice";
import webzineReducer from "./webzineLikeSlice";

const store = configureStore({
  reducer: {
    likes: likesReducer,
    comments: commentsReducer,
    webzineLikes: webzineReducer,
  },
});

export default store;
