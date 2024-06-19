const express = require('express');
const Like = require('../models/Like');
const router = express.Router();

router.get('/', async (req, res) => {
    const { cocktailId, userId } = req.query;
    try {
        const like = await Like.findOne({ cocktailId, userId });
        res.status(200).json({ liked: !!like });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching like status' });
    }
});

router.post('/', async (req, res) => {
    const { cocktailId, userId, liked } = req.body;
    try {
        if (liked) {
            const newLike = new Like({ cocktailId, userId });
            await newLike.save();
        } else {
            await Like.deleteOne({ cocktailId, userId });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error toggling like status' });
    }
});

module.exports = router;
