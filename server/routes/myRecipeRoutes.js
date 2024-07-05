const express = require("express");
const router = express.Router();
const myRecipeController = require("../controllers/myRecipeController");
const { myRecipeUpload } = require("../utils/storage");
const authenticateJWT = require("../middleware/authMiddleware");

router.post("/", authenticateJWT, myRecipeUpload.array("files", 3), myRecipeController.createMyRecipe);
router.get("/", myRecipeController.getMyRecipes);
router.get("/:id", myRecipeController.getMyRecipe);
router.put("/:id", authenticateJWT, myRecipeUpload.array("files", 3), myRecipeController.updateMyRecipe);
router.delete("/:id", authenticateJWT, myRecipeController.deleteMyRecipe);
router.get("/user", authenticateJWT, myRecipeController.getMyRecipesByAuthor);

module.exports = router;
