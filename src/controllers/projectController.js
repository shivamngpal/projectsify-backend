const { z } = require("zod");
// const jwt = require("jsonwebtoken");
const ProjectModel = require("../models/Project");

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

        const userId = req.user.userId;

        const newProject = await ProjectModel.create({
            userId,
            projectDescription: validatedData.data.projectDescription
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