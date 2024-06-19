import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, submitComment, deleteComment, updateComment } from '../../store/commentSlice';

const CommentSection = ({ cocktailId, userId }) => {
    const dispatch = useDispatch();
    const comments = useSelector((state) => state.comments.comments);
    const [newComment, setNewComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    useEffect(() => {
        dispatch(fetchComments({ cocktailId }));
    }, [dispatch, cocktailId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(submitComment({ cocktailId, userId, text: newComment }));
        setNewComment('');
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
        dispatch(updateComment({ commentId: editCommentId, text: editCommentText }));
        setEditCommentId(null);
        setEditCommentText('');
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
                                <button type="submit">Update</button>
                                <button type="button" onClick={() => setEditCommentId(null)}>
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                <p>{comment.text}</p>
                                <small>by {comment.userId}</small>
                                {comment.userId === userId && (
                                    <>
                                        <button onClick={() => handleEdit(comment._id, comment.text)}>Edit</button>
                                        <button onClick={() => handleDelete(comment._id)}>Delete</button>
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
                    placeholder="Add a comment"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CommentSection;
