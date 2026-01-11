function validateTasks(tasks) {
  if (!Array.isArray(tasks)) {
    throw new Error("Tasks is not an array");
  }
  // Be a bit more lenient with AI output size
  if (tasks.length < 12 || tasks.length > 40) {
    throw new Error("Task count must be between 12 and 40");
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
  tasks.forEach((task, idx) => {
    // required fields exist
    for (const field of required) {
      if (task[field] === undefined || task[field] === null) {
        throw new Error(`Task ${idx + 1}: ${field} does not exist in task`);
      }
    }

    // description: string, max 2 sentences/lines
    if (typeof task.description !== "string") {
      throw new Error(`Task ${idx + 1}: Description must be a string`);
    }
    const desc = task.description.trim().replace(/\n+/g, " ");
    const sentences = desc
      .split(/[.!?]+\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length);
    if (sentences.length === 0 || sentences.length > 3) {
      throw new Error(`Task ${idx + 1}: Description must be 1-3 sentences`);
    }

    // estimatedTime: string like "10 minutes"
    if (typeof task.estimatedTime !== "string") {
      throw new Error(`Task ${idx + 1}: estimatedTime must be a string`);
    }
    const est = task.estimatedTime.trim();
    if (est.length === 0) {
      throw new Error(`Task ${idx + 1}: estimatedTime is empty`);
    }
    // Allow either pure numbers or human-friendly strings; if pure number, append minutes
    if (/^\d+$/.test(est)) {
      task.estimatedTime = `${est} minutes`;
    } else if (!/[a-zA-Z]/.test(est)) {
      throw new Error(
        `Task ${idx + 1}: estimatedTime must be readable (e.g., '30 minutes')`
      );
    }

    // phase valid and ordered
    const rank = phaseOrder[task.phase];
    if (rank === undefined || rank < lastPhaseRank) {
      throw new Error(`Task ${idx + 1}: Invalid phase order`);
    }
    lastPhaseRank = rank;

    // difficulty enum
    if (!["Easy", "Medium", "Hard"].includes(task.difficulty)) {
      throw new Error(
        `Task ${idx + 1}: Difficulty must be Easy | Medium | Hard`
      );
    }
    // completed must be false
    if (task.completed !== false) {
      throw new Error(`Task ${idx + 1}: Completed must be false`);
    }
  });
  return true;
}

module.exports = validateTasks;
