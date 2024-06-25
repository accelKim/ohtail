const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const webzineSchema = new Schema(
  {
    title: String,
    content: String,
    cover: String,
    author: String,
    nickname: String,
  },
  { timestamps: true }
);

const webzineModel = model('Webzine', webzineSchema);
module.exports = webzineModel;
