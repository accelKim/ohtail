const express = require('express');
const router = express.Router();
const Webzine = require('../models/webzine');
const authenticateJWT = require('../middlewares/authenticateJWT');

// 웹진 작성
router.post('/', authenticateJWT, async (req, res) => {
    const { title, content } = req.body;
    const author = req.user.userid;

    try {
        const newWebzine = new Webzine({ title, author, content });
        await newWebzine.save();
        res.status(201).json(newWebzine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 최신 웹진 가져오기
router.get('latestWebzine', async (req, res) => {
    try {
        const latestWebzine = await Webzine.findOne().sort({ createdAt: -1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 웹진 수정
router.put('/:id', authenticateJWT, async (req, res) => {
    const { title, content } = req.body;

    try {
        const updatedWebzine = await Webzine.findByIdAndUpdate(
            req.params.id,
            { title, content, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedWebzine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 웹진 삭제
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        await Webzine.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: '웹진이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
