const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cocktailId: {
    type: String,
    required: true,
  },
  isExternal: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
