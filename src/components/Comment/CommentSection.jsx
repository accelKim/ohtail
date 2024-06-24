import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  submitComment,
  deleteComment,
  updateComment,
} from "../../store/commentSlice";

const CommentSection = ({ cocktailId, userId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    dispatch(fetchComments({ cocktailId }));
  }, [dispatch, cocktailId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitComment({ cocktailId, userId, text: newComment }));
    setNewComment("");
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment({ commentId }));
  };

  const handleEdit = (commentId, text) => {
    setEditCommentId(commentId);
    setEditCommentText(text);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(
      updateComment({ commentId: editCommentId, text: editCommentText })
    );
    setEditCommentId(null);
    setEditCommentText("");
  };

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            {editCommentId === comment._id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                />
                <button type="submit">확인</button>
                <button type="button" onClick={() => setEditCommentId(null)}>
                  취소
                </button>
              </form>
            ) : (
              <>
                <p>{comment.text}</p>
                <small>작성자 : {comment.userId}</small>
                {(comment.userId === userId ||
                  comment.userId.toString() === userId.toString()) && ( // 숫자와 문자열을 모두 비교할 수 있게 추가
                  <>
                    <button
                      onClick={() => handleEdit(comment._id, comment.text)}
                    >
                      수정
                    </button>
                    <button onClick={() => handleDelete(comment._id)}>
                      삭제
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글내용을 입력하세요"
        />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default CommentSection;
