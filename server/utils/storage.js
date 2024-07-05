const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const myRecipeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadsMyRecipe/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const myRecipeUpload = multer({ storage: myRecipeStorage });

const webzineStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "webzineUploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const webzineUpload = multer({ storage: webzineStorage });

module.exports = {
  upload,
  myRecipeUpload,
  webzineUpload,
};
