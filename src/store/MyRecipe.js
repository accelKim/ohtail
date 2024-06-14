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
});

module.exports = mongoose.model("MyRecipe", myRecipeSchema);
