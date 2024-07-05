const Webzine = require("../models/Webzine");
const realFs = require("fs");

const getWebzineList = async (req, res) => {
  const webzineList = await Webzine.find().sort({ createdAt: -1 }).limit(10);
  res.json(webzineList);
};

const createWebzine = async (req, res) => {
  console.log("webzineWrite 사용자 정보 확인: --- ", req.user);
  console.log("webzine test req.body: ", JSON.parse(JSON.stringify(req.body)));
  console.log("webzine test req.file: ", req.file);

  const { path, originalname } = req.file;
  const part = originalname.split(".");
  const ext = part[part.length - 1];
  const newPath = path + "." + ext;

  realFs.renameSync(path, newPath);

  const { title, summary, content } = req.body;
  const webzineDoc = await Webzine.create({
    title,
    summary,
    content,
    cover: newPath,
    author: req.user.userid,
    nickname: "오테일",
  });
  res.json(webzineDoc);
};

const getWebzineListAll = async (req, res) => {
  console.log("요청");
  const webzineList = await Webzine.find().sort({ createdAt: -1 });
  res.json(webzineList);
  console.log(webzineList);
};

const getWebzineDetail = async (req, res) => {
  const { id } = req.params;
  const webzineDoc = await Webzine.findById(id);
  res.json(webzineDoc);
};

const deleteWebzine = async (req, res) => {
  const { id } = req.params;
  await Webzine.findByIdAndDelete(id);
  res.json({ message: "ok" });
};

const getWebzineEdit = async (req, res) => {
  const { id } = req.params;
  const webzineDoc = await Webzine.findById(id);
  res.json(webzineDoc);
};

const updateWebzine = async (req, res) => {
  const { id } = req.params;
  let newPath = null;

  if (req.file) {
    const { path, originalname } = req.file;
    const part = originalname.split(".");
    const ext = part[part.length - 1];
    newPath = path + "." + ext;
    realFs.renameSync(path, newPath);
  }

  const { title, summary, content } = req.body;
  try {
    const webzineDoc = await Webzine.findById(id);
    if (!webzineDoc) {
      return res.status(404).json({ message: "웹진을 찾을 수 없습니다." });
    }

    await Webzine.findByIdAndUpdate(id, {
      title,
      summary,
      content,
      cover: newPath ? newPath : webzineDoc.cover,
    });

    res.json({ message: "ok" });
  } catch (updateError) {
    console.error("Error updating webzine: ", updateError);
    res.status(500).json({ message: "웹진 업데이트 실패" });
  }
};

module.exports = {
  getWebzineList,
  createWebzine,
  getWebzineListAll,
  getWebzineDetail,
  deleteWebzine,
  getWebzineEdit,
  updateWebzine,
};
