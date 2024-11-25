const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    name: String,
    email: {type:String, unique:true},
    phone_number : String,
    profilePic: { type: String },
    password: String,
    signinMethod: String,
    posts :[{ type: mongoose.Schema.Types.ObjectId, ref: 'House' }],
    likedPosts : [{type: mongoose.Schema.Types.ObjectId}]
  });
  

  const UserModel = mongoose.model('User', UserSchema);

  module.exports = UserModel;