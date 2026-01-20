const express = require("express");
const {createProject,getProject, getUserProjects} = require("../controllers/projectController.js");
const protectRoute = require("../middleware/authMiddleware.js");
const updateTaskCompletion = require("../controllers/taskController.js");
const createTaskGuidance = require("../controllers/taskGuidanceController.js");

const projectRouter = express.Router();

// create project
projectRouter.post("/projects", protectRoute, createProject);
// update task completion status
projectRouter.patch("/projects/:projectId/tasks/:taskId",protectRoute,updateTaskCompletion);
// fetch a particular project with matching projectId
projectRouter.get("/projects/:projectId",protectRoute,getProject);
// create and store task guidance
projectRouter.post("/projects/:projectId/tasks/:taskId/guidance",protectRoute,createTaskGuidance);
// get all the projects of a user
projectRouter.get("/user/projects",protectRoute,getUserProjects);

module.exports = projectRouter;