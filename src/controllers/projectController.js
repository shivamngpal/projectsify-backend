const { z, success } = require("zod");
// const jwt = require("jsonwebtoken");
const ProjectModel = require("../models/Project");
const generateTask = require("../services/taskGeneration.service.js");
const validateTasks = require("../utils/taskValidator.js");
const { default: mongoose } = require("mongoose");

const max_attempts = Number(process.env.MAX_ATTEMPTS) || 3;

async function createProject(req, res) {
  try {
    // in headers, we get JWT and in body, we get projectDesc-> for now
    const projSchema = z.object({
      projectDescription: z.string("Project Description is not a String"),
    });

    // const projectDesc = req.body.projectDescription;
    const validatedData = projSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        msg: "Project could not be created",
        error: validatedData.error.issues,
      });
    }
    let finalTasks = null;
    let attemptCount = 1;
    while (attemptCount <= max_attempts) {
      try {
        // generate a list of tasks
        const generatedTasks = await generateTask(validatedData.data.projectDescription);
        validateTasks(generatedTasks);
        finalTasks = generatedTasks;
        break;
      } catch (err) {
        if (attemptCount === max_attempts) {
          console.error("Max attempts reached, returning 422");
          return res.status(422).json({
            success: false,
            msg: "Generated Tasks could not be validated",
            error: err.message,
          });
        }
      }
      attemptCount++;
    }

    // auth middleware saves userId to req.user
    const userId = req.user.userId;

    const newProject = await ProjectModel.create({
      userId,
      projectDescription: validatedData.data.projectDescription,
      tasks: finalTasks,
    });

    res.status(201).json({
      success: true,
      msg: "Project created successfully",
      projectId: newProject._id,
      projectDescription: newProject.projectDescription,
      createdAt: newProject.createdAt,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Some error occured",
    });
  }
}

async function getProject(req, res) {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        msg: "Invalid projectId or userId",
      });
    }

    const project = await ProjectModel.findOne({
      userId,
      _id: projectId,
    }).select("-userId -updatedAt -__v");
    if (!project) {
      return res.status(404).json({
        success: false,
        msg: "Project does not exist",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Fetched Project Successfully",
      project: project,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Failed to fetch Project",
    });
  }
}

async function getUserProjects(req,res){
  try{
    const userId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid projectId or userId",
      });
    }

    const projects = await ProjectModel.find({userId});

    return res.status(200).json({
      success: true,
      msg: "Projects fetched successfully",
      projects: projects,
    });
  }catch(err){
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch projects",
      error: err.message,
    });
  }
}

module.exports = { createProject, getProject, getUserProjects };
