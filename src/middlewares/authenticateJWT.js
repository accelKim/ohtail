const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.headers('authorization');

  if (!token) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token.split('')[1], 'yeji'); // check
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = authenticateJWT;
