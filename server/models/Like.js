const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'MyRecipe', required: true },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
