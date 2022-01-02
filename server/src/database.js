const { User } = require('./model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://Admin:bC68Z0sLv6kiI5Jj@cluster0.nxaee.mongodb.net/dashboard?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connecté à Mongoose")
});

const createUser = async data => {
  const res = await User.findOne({email: data.email})
  if (res == null) {
    if (data.password != undefined)
      data.password = await bcrypt.hashSync(data.password, 8);
    const user = await User.create(data)
    return user;
  }
  if (data.password == undefined) {
    return await loginUser(data);
  }
  return {error: {message: 'Email already used', status: 403}};
}

const loginUser = async data => {
  const user = await User.findOne({email: data.email})
  if (user == null)
    return {error: {message: 'User not registered', status: 404}}
  if (data.password == null) {
    if (user.password == undefined)
      return user;
    else
      return {error: {message: 'Google account already registered without google oauth', status: 403}}
  }
  if (!bcrypt.compareSync(data.password, user.password))
    return {error: {message: 'Wrong password', status: 403}}
  return user
}

const modifyUser = async data => {
  const user = await User.findOneAndUpdate(data.args1, data.args2, {
    new: true
  });
  if (user == null)
    return {error: {message: "User to update not found", status: 403}}
  return user
}

const getUser = async token => {
  const user = await User.findOne({accessToken: token})
  return user;
}

const logout = async token => {
  const user = await User.findOne({accessToken: token})
  if (user != null) {
    user.accessToken = undefined;
    user.save()
  }
  return user;
}

module.exports = {
    db: db,
    createUser: createUser,
    loginUser: loginUser,
    modifyUser: modifyUser,
    getUser: getUser,
    logout: logout
};