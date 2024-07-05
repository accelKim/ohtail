const Favorite = require("../models/Favorite");

const addFavorite = async (req, res) => {
  try {
    const { cocktailId, userId, isExternal } = req.body;
    if (!cocktailId || !userId) {
      return res
        .status(400)
        .json({ message: "cocktailId와 userId가 필요합니다." });
    }

    const existingFavorite = await Favorite.findOne({
      userId,
      cocktailId,
      isExternal,
    });
    if (existingFavorite) {
      return res.status(400).json({ message: "이미 즐겨찾기된 레시피입니다." });
    }

    const newFavorite = new Favorite({ userId, cocktailId, isExternal });
    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error("즐겨찾기 추가 중 오류 발생:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { cocktailId, userId, isExternal } = req.body;
    if (!cocktailId || !userId) {
      return res
        .status(400)
        .json({ message: "cocktailId와 userId가 필요합니다." });
    }

    await Favorite.findOneAndDelete({ userId, cocktailId, isExternal });
    res.status(200).json({ message: "즐겨찾기가 삭제되었습니다." });
  } catch (error) {
    console.error("즐겨찾기 삭제 중 오류 발생:", error);
    res.status(500).json({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userid;
    const favorites = await Favorite.find({ userId });
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFavorite,
  deleteFavorite,
  getFavorites,
};
