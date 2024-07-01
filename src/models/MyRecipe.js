const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, required: true },
});

const myRecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  files: [{ type: String, required: true }],
  ingredients: [ingredientSchema],
  instructions: { type: String, required: true },
  author: { type: String, required: true },
  authorNickname: { type: String, required: true }, // 사용자 닉네임 필드 추가
  createdAt: { type: Date, default: Date.now },
  likeCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("MyRecipe", myRecipeSchema);
