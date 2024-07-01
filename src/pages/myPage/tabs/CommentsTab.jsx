import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        const response = await fetch(
          `http://localhost:8080/comments/user?userId=${userId}`
        );
        const data = await response.json();
        console.log("Response from server:", data);
        setComments(data.comments);
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

  const handleCommentClick = async (comment) => {
    let url = "";
    let isExternal = false;

    if (comment.type === "recipe") {
      // 외부 API URL 설정
      url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${comment.cocktailId}`;
      isExternal = true;
    } else if (comment.type === "myRecipe") {
      url = `/myRecipe/${comment.cocktailId}`;
    } else if (comment.type === "feed") {
      url = `/feedDetail/${comment.cocktailId}`;
    } else {
      console.error("댓글 타입 확인 오류", comment.type);
      return;
    }

    console.log("Fetching URL:", url);

    try {
      const response = await fetch(
        isExternal ? url : `http://localhost:8080${url}`
      );
      const data = await response.json();
      console.log("Response:", data);
      if (response.status === 200) {
        if (data) {
          if (comment.type === "recipe") {
            // RecipeDetail 컴포넌트로 이동
            navigate(`/recipe/${comment.cocktailId}`, { state: { data } });
          } else {
            navigate(url);
          }
        } else {
          console.error("게시글을 찾을 수 없습니다.");
          alert("해당 게시글을 찾을 수 없습니다.");
        }
      } else {
        console.error("게시글을 찾을 수 없습니다.");
        alert("해당 게시글을 찾을 수 없습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("게시글이 삭제되었습니다.");
        alert("해당 게시글이 삭제되었습니다.");
      } else {
        console.error("게시글을 가져오는 중 오류 발생:", error.message);
        alert("게시글을 가져오는 중 오류가 발생했습니다.");
      }
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
