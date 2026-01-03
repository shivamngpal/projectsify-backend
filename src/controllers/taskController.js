const mongoose = require("mongoose");
const ProjectModel = require("../models/Project");

async function updateTaskCompletion(req, res) {
  try {
    const { projectId, taskId } = req.params;
    const { completed } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid projectId or taskId",
      });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        msg: "`completed` must be a boolean",
      });
    }

    //Atomic update (secure + concurrency-safe)
    const result = await ProjectModel.findOneAndUpdate(
      {
        _id: projectId,
        userId: userId,
        "tasks._id": taskId,
      },
      {
        $set: { "tasks.$.completed": completed },
      },
      {
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        msg: "Project or task not found",
      });
    }

    return res.status(200).json({
      success: true,
      taskId,
      completed,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Failed to update task",
      error: err.message,
    });
  }
}

module.exports = updateTaskCompletion;