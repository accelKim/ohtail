const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: Number,
    required: true,
    unique: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
