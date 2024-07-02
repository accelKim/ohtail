import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLikeStatus, toggleLikeStatus } from '../../store/likeSlice';
import '../../styles/like/LikeButton.css';

const LikeButton = ({ webzineId, userId }) => {
  const dispatch = useDispatch();
  const { liked, likeCount } = useSelector((state) => state.likes);

  useEffect(() => {
    dispatch(fetchLikeStatus({ webzineId, userId }));
  }, [dispatch, webzineId, userId]);

  const handleToggleLike = () => {
    dispatch(toggleLikeStatus({ webzineId, userId, liked: !liked }));
  };

  return (
    <div className="like-button-container">
      <button
        className={`like-button ${liked ? 'liked' : ''}`}
        onClick={handleToggleLike}
      >
        {liked ? '좋아요' : '좋아요'}
      </button>
      <span className="like-count">{likeCount}</span>
      {liked && <div className="heart-animation">❤️</div>}
    </div>
  );
};

export default LikeButton;
