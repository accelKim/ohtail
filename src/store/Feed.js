const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const FeedSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  cover: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now, // 기본값으로 현재 시간 사용
  },
  author: { type: String },
  authorNickname: { type: String }, // 작성자 닉네임 필드 추가
});

const FeedModel = model('Feed', FeedSchema);
module.exports = FeedModel;
