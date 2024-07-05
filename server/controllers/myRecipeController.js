const MyRecipe = require("../models/MyRecipe");
const User = require("../models/User");

const createMyRecipe = async (req, res) => {
  try {
    const { title, description, instructions } = req.body;
    const files = req.files.map((file) => file.path);
    const ingredients = [];
    const author = req.user.userid;

    const user = await User.findOne({ userid: author });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const authorNickname = user.nickname;

    console.log("Author:", author);
    console.log("Author Nickname:", authorNickname);

    for (let i = 0; req.body[`ingredient_${i}_name`]; i++) {
      ingredients.push({
        name: req.body[`ingredient_${i}_name`],
        quantity: req.body[`ingredient_${i}_quantity`],
        unit: req.body[`ingredient_${i}_unit`],
      });
    }

    const myRecipe = new MyRecipe({
      title,
      description,
      files,
      ingredients,
      instructions,
      author,
      authorNickname,
    });

    await myRecipe.save();
    res.status(201).json(myRecipe);
  } catch (error) {
    console.error("레시피 생성 중 오류 발생:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMyRecipes = async (req, res) => {
  try {
    const recipes = await MyRecipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRecipe = async (req, res) => {
  try {
    const myRecipe = await MyRecipe.findById(req.params.id);
    res.status(200).json(myRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyRecipe = async (req, res) => {
  try {
    const { title, description, instructions } = req.body;
    const newFiles = req.files.map((file) => file.path);
    const existingFiles = JSON.parse(req.body.existingFiles);
    const removedFiles = JSON.parse(req.body.removedFiles);
    const ingredients = [];

    for (let i = 0; req.body[`ingredient_${i}_name`]; i++) {
      ingredients.push({
        name: req.body[`ingredient_${i}_name`],
        quantity: req.body[`ingredient_${i}_quantity`],
        unit: req.body[`ingredient_${i}_unit`],
      });
    }

    const updatedFiles = existingFiles.filter(
      (file) => !removedFiles.includes(file)
    );
    const allFiles = [...updatedFiles, ...newFiles];

    const updatedRecipe = {
      title,
      description,
      files: allFiles,
      ingredients,
      instructions,
    };

    const result = await MyRecipe.findByIdAndUpdate(
      req.params.id,
      updatedRecipe,
      { new: true }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMyRecipe = async (req, res) => {
  try {
    await MyRecipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "레시피가 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRecipesByAuthor = async (req, res) => {
  try {
    const userId = req.user.userid;
    const recipes = await MyRecipe.find({ author: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("레시피 불러오기 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "레시피 불러오기 중 오류가 발생했습니다." });
  }
};

module.exports = {
  createMyRecipe,
  getMyRecipes,
  getMyRecipe,
  updateMyRecipe,
  deleteMyRecipe,
  getMyRecipesByAuthor,
};
