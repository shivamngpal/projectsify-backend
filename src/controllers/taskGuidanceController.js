const mongoose = require("mongoose");
const ProjectModel = require("../models/Project");
const generateGuidance = require("../services/taskGuidanceGeneration.service");

async function createTaskGuidance(req,res){
    try{

        const {projectId,taskId} = req.params;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(projectId) ||!mongoose.Types.ObjectId.isValid(taskId)){
            return res.status(400).json({
                success: false,
                msg: "Invalid projectId or taskId",
            });
        }
    
        const project = await ProjectModel.findOne(
            {
                userId, 
                _id:projectId, 
                "tasks._id": taskId
            }
        );

        if (!project) {
          return res.status(404).json({
            success: false,
            msg: "Project or task not found",
          });
        }

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
        
        if(!task || !taskTitle || typeof taskTitle !== String || !taskDescription || typeof taskDescription !== String){
            return res.status(400).json({
                success:false,
                msg: "Task Title or description does not exist"
            });
        }

        const generatedGuidance = await generateGuidance(projectDescription,taskTitle,taskDescription);
        
        if(!generateGuidance || !Array.isArray(generateGuidance.steps || typeof generateGuidance.verification !== String)){
            return res.status(500).json({
              success: false,
              msg: "Invalid guidance generated",
            });

        }
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