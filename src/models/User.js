const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
},{timestamps:true});

const UserModel = mongoose.model('users',User);
module.exports = UserModel;