import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../../styles/myPage/CommentsTab.module.css";
const apiUrl = process.env.REACT_APP_API_URL

const CommentsTab = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = payload ? payload.userid : null;

  useEffect(() => {
    const fetchComments = async () => {
      console.log('Fetching comments for userId:', userId);
      try {
        const response = await fetch(
          `${apiUrl}/comments/user?userId=${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setComments(data.comments || []); // 데이터가 없을 경우 빈 배열로 설정
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error('댓글을 가져오는 중 오류 발생:', error);
        setError('댓글을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchComments();
    } else {
      console.error('유효하지 않은 사용자 ID');
      setLoading(false); // 유효하지 않은 사용자 ID일 때 로딩 상태 업데이트
    }
  }, [userId]);

  const handleCommentClick = async (comment) => {
    let url = '';
    let isExternal = false;

    if (comment.type === 'recipe') {
      // 외부 API URL 설정
      url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${comment.cocktailId}`;
      isExternal = true;
    } else if (comment.type === 'myRecipe') {
      url = `/myRecipe/${comment.cocktailId}`;
    } else if (comment.type === 'feed') {
      url = `/feedDetail/${comment.cocktailId}`;
    } else {
      console.error('댓글 타입 확인 오류', comment.type);
      return;
    }

    console.log('Fetching URL:', url);

    try {
      const response = await fetch(
        isExternal
          ? url
          : `${apiUrl}/${url}`
        // isExternal ? url : `http://localhost:8080${url}`
      );
      const data = await response.json();
      console.log('Response:', data);
      if (response.status === 200) {
        if (data) {
          if (comment.type === 'recipe') {
            navigate(`/recipe/${comment.cocktailId}`, { state: { data } });
          } else {
            navigate(url);
          }
        } else {
          console.error('게시글을 찾을 수 없습니다.');
          alert('해당 게시글을 찾을 수 없습니다.');
        }
      } else {
        console.error('게시글을 찾을 수 없습니다.');
        alert('해당 게시글을 찾을 수 없습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('게시글이 삭제되었습니다.');
        alert('해당 게시글이 삭제되었습니다.');
      } else {
        console.error('게시글을 가져오는 중 오류 발생:', error.message);
        alert('게시글이 삭제되었습니다.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={style.container}>
      <ul className={style.commentList}>
        {comments.map((comment) => (
          <li key={comment._id} className={style.commentItem}>
            <div>
              <p className={style.commentTitle}>{comment.title}</p>
              <p className={style.commentText}>{comment.text}</p>

              <small className={style.commentDate}>
                {/* {new Date(comment.createdAt).toLocaleDateString()} */}
              </small>
            </div>
            <button
              className={style.viewButton}
              onClick={() => handleCommentClick(comment)}
            >
              본문보기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsTab;
