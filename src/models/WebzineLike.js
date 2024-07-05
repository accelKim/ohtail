const mongoose = require("mongoose");

const webzineLikeSchema = new mongoose.Schema({
  webzineId: { type: String, required: true },
  userId: { type: String, required: true },
});

const WebzineLike = mongoose.model("WebzineLike", webzineLikeSchema);
module.exports = WebzineLike;
