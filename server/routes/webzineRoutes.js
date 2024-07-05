const express = require("express");
const router = express.Router();
const webzineController = require("../controllers/webzineController");
const { webzineUpload } = require("../utils/storage");
const authenticateJWT = require("../middleware/authMiddleware");

router.get("/", webzineController.getWebzineList);
router.post("/", webzineUpload.single("files"), authenticateJWT, webzineController.createWebzine);
router.get("/list", webzineController.getWebzineListAll);
router.get("/:id", webzineController.getWebzineDetail);
router.delete("/:id", webzineController.deleteWebzine);
router.get("/:id/edit", webzineController.getWebzineEdit);
router.put("/:id", authenticateJWT, webzineUpload.single("files"), webzineController.updateWebzine);

module.exports = router;
