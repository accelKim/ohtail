const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();
  } catch (error) {
    console.error("토큰 인증 실패:", error);
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = authenticateJWT;
