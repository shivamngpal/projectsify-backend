const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    projectDescription: {type: String, required:true},
    tasks: [],
},{timestamps:true});

const ProjectModel = mongoose.model("project", ProjectSchema);
module.exports = ProjectModel;