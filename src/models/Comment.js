const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  cocktailId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, required: true }, // 댓글 단 게시글의 유형 확인 (레시피, 나만의 레시피, 피드)
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
