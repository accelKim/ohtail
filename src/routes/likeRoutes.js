const express = require("express");
const Like = require("../models/Like");
const MyRecipe = require("../store/MyRecipe");
const router = express.Router();

router.get("/", async (req, res) => {
  const { cocktailId, userId } = req.query;
  try {
    const like = await Like.findOne({ cocktailId, userId });
    const likeCount = await Like.countDocuments({ cocktailId });
    res.status(200).json({ liked: !!like, likeCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching like status" });
  }
});

router.post("/", async (req, res) => {
  const { cocktailId, userId, liked } = req.body;
  try {
    if (liked) {
      const newLike = new Like({ cocktailId, userId });
      await newLike.save();
      await MyRecipe.findByIdAndUpdate(cocktailId, { $inc: { likeCount: 1 } }); // 나만의 레시피 좋아요 증가
    } else {
      await Like.deleteOne({ cocktailId, userId });
      await MyRecipe.findByIdAndUpdate(cocktailId, { $inc: { likeCount: -1 } }); // 나만의 레시피 좋아요 감소
    }
    const likeCount = await Like.countDocuments({ cocktailId });
    res.status(200).json({ success: true, liked, likeCount });
  } catch (error) {
    res.status(500).json({ error: "Error toggling like status" });
  }
});

module.exports = router;
