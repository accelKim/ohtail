const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateJWT = require("../middleware/authMiddleware");

router.get("/:id", authenticateJWT, userController.getUser);
router.put("/:id/nickname", authenticateJWT, userController.updateNickname);

module.exports = router;
