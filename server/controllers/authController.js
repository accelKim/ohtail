const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Counter = require('../models/Counter');
const User = require('../models/User');

const generateAccessToken = (userid) => {
  if (!process.env.JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not defined');
    throw new Error('JWT_SECRET_KEY is not defined');
  }
  return jwt.sign({ userid }, process.env.JWT_SECRET_KEY, { expiresIn: '3h' });
};

// 이메일 중복 확인 API
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: '이미 사용중인 이메일입니다!' });
    }

    res.status(200).json({ message: '사용 가능한 이메일입니다!' });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 닉네임 중복 확인 API
const checkNickname = async (req, res) => {
  try {
    const { nickname } = req.body;
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 닉네임입니다!' });
    }
    res.status(200).json({ message: '사용 가능한 닉네임입니다!' });
  } catch (error) {
    console.error('Error checking nickname:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 회원가입
const signup = async (req, res) => {
  const {
    userid,
    password,
    email,
    phonenumber,
    nickname,
    drinkingFrequency,
    preferredIngredients,
    preferredAlcoholLevel,
  } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('해싱된 비밀번호:', hashedPassword);

    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const newUser = new User({
      userid: counter.sequence_value,
      password: hashedPassword,
      email,
      phonenumber,
      nickname,
      drinkingFrequency,
      preferredIngredients,
      preferredAlcoholLevel,
    });

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
};

// 로그인
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('로그인 요청 받음:', { email, password });

    const user = await User.findOne({ email });
    console.log('사용자 찾기 결과:', user);

    if (!user) {
      console.log('사용자를 찾을 수 없습니다:', email);
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('비밀번호 비교 결과:', passwordMatch);

    if (passwordMatch) {
      console.log('로그인 성공:', email);
      const token = generateAccessToken(user.userid);
      res.status(200).json({
        message: '로그인 성공',
        token,
        userid: user.userid,
        nickname: user.nickname,
      });
    } else {
      console.log('비밀번호가 일치하지 않습니다:', email);
      res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  checkEmail,
  checkNickname,
  signup,
  login,
};
