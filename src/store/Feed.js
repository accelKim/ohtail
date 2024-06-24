const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const FeedSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  cover: { type: String, required: true },
});

const FeedModel = model('Feed', FeedSchema);
module.exports = FeedModel;
