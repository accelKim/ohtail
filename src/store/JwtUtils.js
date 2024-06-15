const jwt = require('jsonwebtoken');

const generateAccessToken = (userid) => {
  return jwt.sign({ userid }, 'your_secret_key', { expiresIn: '3h' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
    // 토큰이 없을 경우
  }

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) {
      console.error('토큰 검증 오류:', err);
      return res.sendStatus(403);
      // 토큰이 유효하지 않을 경우 403
    }
    req.user = user;
    next(); // 인증 성공 시 다음 미들웨어로 진행
  });
};

module.exports = { generateAccessToken, authenticateToken };
