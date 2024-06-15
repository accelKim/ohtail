const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

router.get('/', async (req, res) => {
  const { cocktailId } = req.query;
  try {
    const comments = await Comment.find({ cocktailId }).sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

router.post('/', async (req, res) => {
  const { cocktailId, userId, text } = req.body;
  try {
    const newComment = new Comment({ cocktailId, userId, text });
    await newComment.save();
    res.status(200).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting comment' });
  }
});

router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  try {
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

router.put('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    res.status(500).json({ error: 'Error updating comment' });
  }
});

module.exports = router;
