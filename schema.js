const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true
    },
    password: {
      type: String,
    },
    privateMsg: {
      type: String,
    }
  }
);

const User = mongoose.model('user', userSchema);
module.exports = User