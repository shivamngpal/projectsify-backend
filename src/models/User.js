const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    name: String
});

const UserModel = mongoose.model('users',User);
module.exports = UserModel;