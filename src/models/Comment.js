const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  cocktailId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
