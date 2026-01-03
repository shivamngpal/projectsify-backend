const express = require("express");
const {createProject,getProject} = require("../controllers/projectController.js");
const protectRoute = require("../middleware/authMiddleware.js");
const updateTaskCompletion = require("../controllers/taskController.js");

const projectRouter = express.Router();

// create project
projectRouter.post("/projects", protectRoute, createProject);
// update task completion status
projectRouter.patch("/projects/:projectId/tasks/:taskId",protectRoute,updateTaskCompletion);
// fetch projects
projectRouter.get("/projects/:projectId",protectRoute,getProject);

module.exports = projectRouter;