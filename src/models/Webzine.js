const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const webzineSchema = new Schema({
  title: { type: String, require: true },
  author: { type: String, require: true },
  content: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const webzineModel = model('Webzine', webzineSchema);
module.exports = webzineModel;
