const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  //An array of objectId's for all the posts made by a user
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]

});

const User = mongoose.model("User", UserSchema);

module.exports = User;
