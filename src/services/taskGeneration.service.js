const { GoogleGenAI } = require("@google/genai");

const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

async function generateTask(projdesc) {
  if (!ai) {
    throw new Error("Gemini API key is not defined");
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a senior software mentor helping a beginner student COMPLETE a project.
            Your task is to break the given project idea into a clear, executable, step-by-step task list that a beginner can follow to FINISH the project without getting overwhelmed.

            You must implicitly choose a suitable, beginner-friendly tech stack.
            Do NOT ask the user to choose a tech stack.

            STRICT RULES (VIOLATING ANY RULE INVALIDATES THE OUTPUT):

            1. Output ONLY valid JSON. No explanations, no markdown, no comments.
            2. Output an ARRAY of task objects.
            3. Total number of tasks MUST be between 20 and 30.
            4. Tasks MUST be sequential and executable in order.
            5. Tasks MUST be grouped in this exact order:
            FOUNDATION → CORE → ADVANCED
            6. Do NOT include tasks about:
            - choosing a tech stack
            - learning concepts
            - researching
            - designing or planning architecture
            - optimization or refactoring
            7. Each task must be executable in one sitting.
            8. Do NOT include guidance, steps, resources, or code inside tasks.
            9. The "completed" field must ALWAYS be false.

            Each task object MUST have EXACTLY these fields:

            {
            "title": string,
            "description": string,
            "phase": "FOUNDATION" | "CORE" | "ADVANCED",
            "difficulty": "Easy" | "Medium" | "Hard",
            "estimatedTime": string,
            "completed": false
            }

            QUALITY CONSTRAINTS:

            - title:
            - 3 to 8 words
            - Must start with a verb
            - Must describe ONE concrete action
            - Forbidden verbs: learn, understand, explore, research, design, optimize

            - description:
            - Maximum 2 sentences
            - Sentence 1: what to do
            - Sentence 2: why it matters
            - No theory or definitions

            - estimatedTime:
            - Human-readable only (e.g. "10-15 minutes", "30 minutes", "~1 hour")
            - No dates, no vague words

            Project Idea: ${projdesc}

            Return ONLY the JSON array of tasks.
            Do not include any other text.`,
  });

  let jsonText = (response?.text || "").trim();
  // Remove markdown code fences if present
  jsonText = jsonText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/, "")
    .trim();

  console.log("Raw Gemini response length:", jsonText.length);
  console.log("First 200 chars:", jsonText.substring(0, 200));

  // convert string to js object
  const tasks = JSON.parse(jsonText);
  console.log("Parsed tasks count:", tasks?.length);
  return tasks;
}

// (async () => {
//     try{
//         const tasks = await generateTask("Create a todo app using MERN stack");
//         console.log("Tasks Length: ", tasks.length);
//         console.log(tasks);
//     }catch(err){
//         console.error("Error: ",err.message);
//     }
// })();
module.exports = generateTask;
