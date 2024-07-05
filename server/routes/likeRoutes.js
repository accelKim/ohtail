const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/add', authenticateJWT, likeController.addLike);
router.delete('/remove', authenticateJWT, likeController.removeLike);
router.get('/', authenticateJWT, likeController.getLikes);

module.exports = router;
