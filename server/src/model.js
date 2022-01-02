const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  "email": String,
  "password": String,
  "firstName": String,
  "lastName": String,
  "accessToken": String,
  "googleToken": String,
  "spotifyToken": String,
  "dashboard": Object,
});

const User = new mongoose.model('User', userSchema)

module.exports = {
    User: User
}