import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../../styles/comments/Comments.module.css";
import {
  fetchComments,
  submitComment,
  deleteComment,
  updateComment,
} from "../../store/commentSlice";

const CommentSection = ({ cocktailId, userId, type }) => {
  // type 필드를 추가합니다.
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
    dispatch(submitComment({ cocktailId, userId, text: newComment, type }));
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
      <h3 className={style.comment_title}>댓글</h3>
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px" }}
        className={style.comment_input_wrap}
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글 내용을 입력하세요"
          className={style.comment_input}
        />
        <button type="submit" className={style.comment_submit_button}>
          등록
        </button>
      </form>
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
              <div className={style.comment_wrap}>
                <small>작성자: {comment.userId}</small>
                {(comment.userId === userId ||
                  comment.userId?.toString() === userId?.toString()) && (
                  <div className={style.comment_content_wrap}>
                    <p className={style.comment_content}>{comment.text}</p>
                    <div>
                      <button
                        onClick={() => handleEdit(comment._id, comment.text)}
                      >
                        수정
                      </button>
                      <button onClick={() => handleDelete(comment._id)}>
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
