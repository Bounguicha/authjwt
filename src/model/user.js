const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = userSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
    },
    password: {
        type: String,
        required: true
    }
});
