const Like = require('../models/Like');
const MyRecipe = require('../models/MyRecipe');
const mongoose = require('mongoose');

const addLike = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.userid);

    if (!recipeId) {
      return res.status(400).json({ message: 'recipeId가 필요합니다.' });
    }

    const existingLike = await Like.findOne({ userId, recipeId });
    if (existingLike) {
      return res.status(400).json({ message: '이미 좋아요를 클릭한 레시피입니다.' });
    }

    const newLike = new Like({ userId, recipeId });
    await newLike.save();

    await MyRecipe.findByIdAndUpdate(recipeId, { $inc: { likesCount: 1 } });

    res.status(201).json({ liked: true, likeCount: newLike.likesCount });
  } catch (error) {
    console.error('좋아요 추가 중 오류 발생:', error);
    res.status(500).json({ message: error.message });
  }
};

const removeLike = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.userid);

    if (!recipeId) {
      return res.status(400).json({ message: 'recipeId가 필요합니다.' });
    }

    const like = await Like.findOneAndDelete({ userId, recipeId });
    if (!like) {
      return res.status(404).json({ message: '좋아요를 찾을 수 없습니다.' });
    }

    await MyRecipe.findByIdAndUpdate(recipeId, { $inc: { likesCount: -1 } });

    res.status(200).json({ liked: false, likeCount: like.likesCount });
  } catch (error) {
    console.error('좋아요 삭제 중 오류 발생:', error);
    res.status(500).json({ message: error.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userid);
    const likes = await Like.find({ userId }).populate('recipeId');
    res.status(200).json(likes);
  } catch (error) {
    console.error('좋아요 리스트를 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLike,
  removeLike,
  getLikes,
};
