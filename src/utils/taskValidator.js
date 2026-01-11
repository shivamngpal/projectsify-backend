function validateTasks(tasks) {
  if (!Array.isArray(tasks)) {
    throw new Error("Tasks is not an array");
  }
  if (tasks.length < 20 || tasks.length > 30) {
    throw new Error("Too less or too many tasks");
  }

  const required = [
    "title",
    "description",
    "phase",
    "difficulty",
    "estimatedTime",
    "completed",
  ];
  const phaseOrder = { FOUNDATION: 0, CORE: 1, ADVANCED: 2 };

  let lastPhaseRank = -1;
  for (const task of tasks) {
    // required fields exist
    for (const field of required) {
      if (task[field] === undefined || task[field] === null) {
        throw new Error(`${field} does not exists in task`);
      }
    }

    // description: string, max 2 sentences/lines
    if (typeof task.description !== "string") {
      throw new Error("Description must be a string");
    }
    const desc = task.description.trim().replace(/\n+/g, " ");
    const sentences = desc
      .split(/[.!?]+\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length);
    if (sentences.length === 0 || sentences.length > 2) {
      console.log("Invalid task:", task);
      throw new Error("Description must be 1-2 sentences");
    }

    // estimatedTime: string like "10 minutes"
    if (typeof task.estimatedTime !== "string") {
      throw new Error("estimatedTime must be a string");
    }
    const est = task.estimatedTime.trim();
    if (est.length === 0 || /^\d+$/.test(est) || !/[a-zA-Z]/.test(est)) {
      throw new Error(
        "estimatedTime must be human-readable (e.g., '10 minutes')"
      );
    }

    // phase valid and ordered
    const rank = phaseOrder[task.phase];
    if (rank === undefined || rank < lastPhaseRank) {
      throw new Error("Invalid phase order");
    }
    lastPhaseRank = rank;

    // difficulty enum
    if (!["Easy", "Medium", "Hard"].includes(task.difficulty)) {
      throw new Error("Difficulty does not exist in task");
    }
    // completed must be false
    if (task.completed !== false) {
      throw new Error("Completed is set to true");
    }
  }
  return true;
}

module.exports = validateTasks;
