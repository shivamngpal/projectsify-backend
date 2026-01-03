const { z } = require("zod");
// const jwt = require("jsonwebtoken");
const ProjectModel = require("../models/Project");
const generateTask = require("../services/taskGeneration.service.js");
const validateTasks = require("../utils/taskValidator.js");

const max_attempts = process.env.MAX_ATTEMPTS;

async function createProject(req,res){
    try{
        // in headers, we get JWT and in body, we get projectDesc-> for now
        const projSchema = z.object({
            projectDescription: z.string("Project Description is not a String")
        });
    
        // const projectDesc = req.body.projectDescription;
        const validatedData = projSchema.safeParse(req.body);
    
        if(!validatedData.success){
            return res.status(400).json({
                success:false,
                msg:"Project could not be created",
                error: validatedData.error.issues
            });
        }
        let finalTasks = null;
        let attemptCount=1;
        while(attemptCount <= max_attempts){
            try{
                // generate a list of tasks
                const generatedTasks = await generateTask(validatedData.data.projectDescription);
                validateTasks(generatedTasks);
                finalTasks=generatedTasks;
                break;
            }catch(err){
                // we have already tried generating tasks {max_attempts} times.
                // thus last attempt also produced error, so return error.
                if(attemptCount === max_attempts){
                    return res.status(422).json({
                        success:false,
                        msg: "Generated Tasks could not be validated",
                        error: err.message,
                    });
                }
            }
            attemptCount++;
        }

        // authmiddleware saves userId to req.user
        const userId = req.user.userId;

        const newProject = await ProjectModel.create({
            userId,
            projectDescription: validatedData.data.projectDescription,
            tasks: generatedTasks
        });

        res.status(201).json({
            success:true,
            msg:"Project created successfully",
            projectId: newProject._id,
            projectDescription: newProject.projectDescription,
            createdAt: newProject.createdAt
        });
    }
    catch(err){
        res.status(400).json({
            success:false,
            msg:"Some error occured"
        });
    }
}

module.exports=createProject;