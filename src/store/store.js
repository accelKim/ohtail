import { configureStore } from '@reduxjs/toolkit';
import likesReducer from './likeSlice';
import commentsReducer from './commentSlice';

const store = configureStore({
    reducer: {
        likes: likesReducer,
        comments: commentsReducer,
    },
});

export default store;
