const express = require("express");
const Comment = require("../models/Comment");
const MyRecipe = require("../models/MyRecipe");
const Feed = require("../store/Feed");
const router = express.Router();

router.get("/", async (req, res) => {
  const { cocktailId } = req.query;
  try {
    const comments = await Comment.find({ cocktailId }).sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// 내가 작성한 댓글 조회
router.get("/user", async (req, res) => {
  const { userId } = req.query;

  try {
    const comments = await Comment.find({ userId }).sort({ createdAt: -1 });

    const commentsWithTitles = await Promise.all(
      comments.map(async (comment) => {
        let title = "";

        if (comment.type === "myRecipe") {
          const recipe = await MyRecipe.findById(comment.cocktailId);
          title = recipe ? recipe.title : "원글이 삭제되었습니다";
        } else if (comment.type === "feed") {
          const feed = await Feed.findById(comment.cocktailId);
          title = feed ? feed.title : "원글이 삭제되었습니다";
        } else if (comment.type === "recipe") {
          // 외부 API 호출 (레시피)
          const response = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${comment.cocktailId}`
          );
          const data = await response.json();
          title = data.drinks
            ? data.drinks[0].strDrink
            : "원글이 삭제되었습니다";
        }

        return { ...comment._doc, title };
      })
    );

    res.status(200).json({ comments: commentsWithTitles });
  } catch (error) {
    console.error("댓글 불러오기 오류", error);
    res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  const { cocktailId, userId, text, type } = req.body;
  try {
    const newComment = new Comment({ cocktailId, userId, text, type });
    await newComment.save();
    res.status(200).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Error submitting comment" });
  }
});

router.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  try {
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
});

router.put("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    );
    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
});

module.exports = router;
