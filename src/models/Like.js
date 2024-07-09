const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  cocktailId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true }, // type 필드 추가
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
