const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userid: {
        type: Number,
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
        type: String, // 전화번호를 String으로 변경
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    drinkingFrequency: {
        type: String,
        required: true,
    },
    preferredIngredients: {
        type: [String], // 문자열 배열로 변경
        required: true,
    },
    preferredAlcoholLevel: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // 타임스탬프 추가

const User = mongoose.model('User', userSchema);

module.exports = User;
