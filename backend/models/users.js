const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userName: { type: String, required: true },
  userSurname: { type: String, required: true },
  userTC: { type: String, required: true },
  userPassword: { type: String, required: true },
  userMail: { type: String },
  userTel: { type: String },
    isAdmin: {
        type: Boolean,
        default: false
      }});

const users = mongoose.model('users', usersSchema);
module.exports = users;
