const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const { upload } = require("../utils/storage");
const authenticateJWT = require("../middleware/authMiddleware");

router.post("/", authenticateJWT, upload.single("imgFile"), feedController.createFeed);
router.get("/", feedController.getFeedList);
router.get("/:id", feedController.getFeedDetail);
router.delete("/:id", feedController.deleteFeed);
router.put("/:id", authenticateJWT, upload.single("imgFile"), feedController.updateFeed);

module.exports = router;
