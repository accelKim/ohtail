const mongoose = require('mongoose');

const webzineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  cover: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nickname: { type: String, required: true },
}, { timestamps: true });

const Webzine = mongoose.model('Webzine', webzineSchema);
module.exports = Webzine;
