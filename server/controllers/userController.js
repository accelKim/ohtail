const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    console.log(`유저 정보 요청 받음: ${userId}`);
    const user = await User.findOne({ userid: userId }).select("nickname");
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("사용자 정보 불러오기 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const updateNickname = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { nickname } = req.body;

    const user = await User.findOneAndUpdate(
      { userid: userId },
      { nickname },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "닉네임이 성공적으로 업데이트되었습니다.",
      nickname: user.nickname,
    });
  } catch (error) {
    console.error("닉네임 업데이트 오류:", error);
    res
      .status(500)
      .json({ message: "닉네임 업데이트 중 오류가 발생했습니다." });
  }
};

module.exports = {
  getUser,
  updateNickname,
};
