import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/like/LikeButton.css";

const LikeButton = ({ recipeId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴
  const userId = localStorage.getItem('userId'); // userId도 로컬 스토리지에서 가져옴

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`/likes?recipeId=${recipeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      } catch (error) {
        console.error("좋아요 상태를 가져오는 중 오류 발생:", error);
      }
    };

    if (token) {
      fetchLikeStatus();
    }
  }, [recipeId, token]);

  const handleToggleLike = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = liked
        ? await axios.delete('/likes/remove', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { recipeId },
          })
        : await axios.post('/likes/add', { recipeId }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("좋아요 상태를 토글하는 중 오류 발생:", error);
    }
  };

  return (
    <div className="like-button-container">
      <button
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={handleToggleLike}
      >
        {liked ? "좋아요 취소" : "좋아요"}
      </button>
      <span className="like-count">{likeCount}</span>
      {liked && <div className="heart-animation">❤️</div>}
    </div>
  );
};

export default LikeButton;
