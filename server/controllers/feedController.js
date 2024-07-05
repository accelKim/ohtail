const Feed = require("../models/Feed");
const path = require("path");
const fs = require("fs").promises;

const createFeed = async (req, res) => {
  try {
    const { originalname } = req.file;
    const tempPath = req.file.path;
    const ext = path.extname(originalname);
    const newPath = tempPath + ext;

    await fs.rename(tempPath, newPath);

    const { title, content } = req.body;
    const imageUrl = `http://localhost:8080/uploads/${path.basename(newPath)}`;
    console.log("생성된 이미지 URL:", imageUrl);

    const newFeed = new Feed({
      title,
      content,
      cover: imageUrl,
      author: req.user.userid,
    });

    await newFeed.save();

    res
      .status(200)
      .json({ message: "피드가 성공적으로 생성되었습니다.", newFeed });
  } catch (error) {
    console.error("피드 생성 중 오류 발생:", error);
    res.status(500).json({ message: "피드 생성 중 오류가 발생했습니다." });
  }
};

const getFeedList = async (req, res) => {
  try {
    const feedList = await Feed.find().sort({ createdAt: -1 });
    res.json(feedList);
  } catch (error) {
    console.error("피드 리스트를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "피드 리스트를 가져오는 중 오류가 발생했습니다." });
  }
};

const getFeedDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const feed = await Feed.findById(id).populate("author", "userid");
    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFeed = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Feed.findByIdAndDelete(id);
  res.json({ message: "ok" });
};

const updateFeed = async (req, res) => {
  const { id } = req.params;

  try {
    let updatedFields = {};

    if (req.file) {
      const { originalname, path: filePath } = req.file;
      const ext = path.extname(originalname);
      const newPath = path.join("uploads", `${id}${ext}`);
      await fs.rename(filePath, newPath);
      updatedFields.cover = `http://localhost:8080/${newPath}`;
    }

    if (req.body.title) {
      updatedFields.title = req.body.title;
    }
    if (req.body.content) {
      updatedFields.content = req.body.content;
    }

    const updatedFeed = await Feed.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedFeed) {
      return res.status(404).json({ message: "해당 피드를 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ message: "피드가 성공적으로 업데이트되었습니다.", updatedFeed });
  } catch (error) {
    console.error("피드 업데이트 중 오류 발생:", error);
    res.status(500).json({ message: "피드 업데이트 중 오류가 발생했습니다." });
  }
};

module.exports = {
  createFeed,
  getFeedList,
  getFeedDetail,
  deleteFeed,
  updateFeed,
};
