const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./src/store/UserStore');
const cors = require('cors');
// const jwt = require('jsonwebtoken');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(
    'mongodb+srv://ohtail:wCvHp9yQNPDK7wOp@cluster0.yzwdj7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {}
  )
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((err) => console.error('MongoDB 연결 실패:', err));

// const bcrypt = require('bcryptjs');
// var salt = bcrypt.genSaltSync(10);

app.post('/signup', async (req, res) => {
  const { userid, password } = req.body;

  try {
    // 이미 존재하는 아이디인지 확인
    const existingUser = await User.findOne({ userid });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: '이미 존재하는 아이디입니다.' });
    }

    // 존재하지 않는 경우 새로운 사용자 생성
    const newUser = new User({ userid, password });
    await newUser.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원가입 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
