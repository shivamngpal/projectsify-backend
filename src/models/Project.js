const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: {type: String, required:true},
    description: {type:String},
    phase:{
        type:String,
        enum:["FOUNDATION","CORE","ADVANCED"],
        default:"FOUNDATION"
    },
    difficulty:{
        type:String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    estimatedTime: {type: String},
    completed: {
        type:Boolean,
        default:false
    },
    guidance:{type: Object}
},{timestamps:true});

const ProjectSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    projectDescription: {type: String, required:true},
    tasks: [TaskSchema],
},{timestamps:true});

const ProjectModel = mongoose.model("project", ProjectSchema);
module.exports = ProjectModel;