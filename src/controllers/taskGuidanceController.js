const mongoose = require("mongoose");
const ProjectModel = require("../models/Project");
const generateGuidance = require("../services/taskGuidanceGeneration.service");

async function createTaskGuidance(req,res){
    try{

        const {projectId,taskId} = req.params;
        const userId = req.user.userId;
    
        const project = await ProjectModel.findOne(
            {
                userId, 
                _id:projectId, 
                "tasks._id": taskId
            }
        );
        const projectDescription = project.projectDescription;
        const task = project.tasks.id(taskId);

        if(task.guidance){
            return res.status(200).json({
                success: true,
                msg: "Guidance Already exists",
                guidance: task.guidance,
                cached: true
            });
        }
        
        const taskTitle = task.title;
        const taskDescription = task.description;
        
        const generatedGuidance = await generateGuidance(projectDescription,taskTitle,taskDescription);
        await ProjectModel.findOneAndUpdate(
            {
                userId,
                _id: projectId,
                "tasks._id": taskId
            },
            {
                $set: {"tasks.$.guidance":generatedGuidance}
            }
        );
    
        res.status(201).json({
            success:true,
            msg: "Guidance generated Successfully",
            guidance: generatedGuidance,
            cached: false
        });
    }
    catch(err){
        res.status(400).json({
            success: false,
            msg: "Guidance could not be generated",
            error: err.message
        });
    }
}

module.exports = createTaskGuidance;