const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  unit: String,
});

const myRecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  files: [String],
  ingredients: [ingredientSchema],
  instructions: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorNickname: { type: String, required: true },
  likesCount: { type: Number, default: 0 }, // 좋아요 수 추가
}, { timestamps: true });

const MyRecipe = mongoose.model('MyRecipe', myRecipeSchema);
module.exports = MyRecipe;
