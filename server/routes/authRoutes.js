const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/check-email", authController.checkEmail);
router.post("/check-nickname", authController.checkNickname);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
