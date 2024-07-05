const express = require("express");
const WebzineLike = require("../models/WebzineLike");
const router = express.Router();

router.get("/", async (req, res) => {
  const { webzineId, userId } = req.query;
  try {
    console.log("GET request - webzineId:", webzineId);
    console.log("GET request - userId:", userId);

    const like = await WebzineLike.findOne({ webzineId, userId });
    const likeCount = await WebzineLike.countDocuments({ webzineId });
    res.status(200).json({ liked: !!like, likeCount });
  } catch (error) {
    console.error("Error fetching like status:", error);
    res.status(500).json({ error: "Error fetching like status" });
  }
});

router.post("/", async (req, res) => {
  const { webzineId, userId, liked } = req.body;
  try {
    console.log("POST request - Received body:", req.body);
    console.log("POST request - webzineId:", webzineId);
    console.log("POST request - userId:", userId);
    console.log("POST request - liked:", liked);

    if (webzineId === undefined) {
      throw new Error("webzineId is undefined");
    }

    if (liked) {
      console.log("Creating new like document");
      const newLike = new WebzineLike({ webzineId, userId });
      await newLike.save();
    } else {
      console.log("Deleting like document");
      await WebzineLike.deleteOne({ webzineId, userId });
    }

    const likeCount = await WebzineLike.countDocuments({ webzineId });
    res.status(200).json({ success: true, liked, likeCount });
  } catch (error) {
    console.error("Error toggling like status:", error);
    res.status(500).json({ error: "Error toggling like status" });
  }
});

module.exports = router;
