import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CommentsTab = () => {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = payload ? payload.userid : null;

  useEffect(() => {
    const fetchComments = async () => {
      console.log("Fetching comments for userId:", userId);
      try {
        const response = await axios.get(
          `http://localhost:8080/comments/user?userId=${userId}`
        );
        console.log("Response from server:", response.data);
        setComments(response.data.comments);
      } catch (error) {
        console.error("댓글을 가져오는 중 오류 발생:", error);
      }
    };

    if (userId) {
      fetchComments();
    } else {
      console.error("유효하지 않은 사용자 ID");
    }
  }, [userId]);

  const handleCommentClick = (comment) => {
    if (comment.type === "recipe") {
      navigate(`/recipe/${comment.cocktailId}`);
    } else if (comment.type === "myRecipe") {
      navigate(`/myRecipe/${comment.cocktailId}`);
    } else if (comment.type === "feed") {
      navigate(`/feed/${comment.cocktailId}`);
    } else {
      console.error("댓글 타입 확인 오류", comment.type);
    }
  };

  return (
    <div>
      <h2>내가 작성한 댓글</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id} onClick={() => handleCommentClick(comment)}>
            <p>{comment.text}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsTab;
