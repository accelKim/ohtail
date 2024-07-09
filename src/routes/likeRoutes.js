const express = require("express");
const Like = require("../models/Like");
const router = express.Router();

// 좋아요 상태 가져오기
router.get("/", async (req, res) => {
  const { cocktailId, userId, type } = req.query;
  try {
    const like = await Like.findOne({ cocktailId, userId, type });
    const likeCount = await Like.countDocuments({ cocktailId, type });
    res.status(200).json({ liked: !!like, likeCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching like status" });
  }
});

// 좋아요 상태 토글
router.post("/", async (req, res) => {
  const { cocktailId, userId, type, liked } = req.body;
  try {
    if (liked) {
      const newLike = new Like({ cocktailId, userId, type });
      await newLike.save();
    } else {
      await Like.deleteOne({ cocktailId, userId, type });
    }
    const likeCount = await Like.countDocuments({ cocktailId, type });
    res.status(200).json({ success: true, liked, likeCount });
  } catch (error) {
    res.status(500).json({ error: "Error toggling like status" });
  }
});

module.exports = router;
