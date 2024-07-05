const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const authenticateJWT = require("../middleware/authMiddleware");

router.post("/", authenticateJWT, favoriteController.addFavorite);
router.delete("/", authenticateJWT, favoriteController.deleteFavorite);
router.get("/", authenticateJWT, favoriteController.getFavorites);

module.exports = router;
