const { GoogleGenAI } = require("@google/genai");
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("Gemini API key is not defined");
}
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

async function generateGuidance(projectDescription, taskTitle, taskDescription) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    contents: `You are a senior software engineer helping a beginner COMPLETE a specific development task.
            Your job is to provide clear, practical guidance ONLY for the given task.
            Do NOT explain general concepts.
            Do NOT teach theory.
            Do NOT give project-wide advice.

            STRICT RULES (VIOLATING ANY RULE INVALIDATES THE OUTPUT):

            1. Output ONLY valid JSON. No explanations, no markdown, no comments.
            2. Output a SINGLE guidance object (not an array).
            3. Guidance MUST be specific to the given task only.
            4. Do NOT reference other tasks.
            5. Do NOT include links, resources, or external documentation.
            6. Do NOT include long paragraphs.
            7. Assume the user is a beginner but already working on this project.
            8. Be concise, practical, and execution-focused.

            The guidance object MUST have EXACTLY these fields:

            {
            "steps": string[],
            "codeSnippets": [
                {
                "language": string,
                "code": string
                }
            ],
            "commonMistakes": string[],
            "verification": string
            }

            FIELD CONSTRAINTS:

            - steps:
            - Must contain at least 2 items
            - Each step must be a short, clear action
            - No theory, no explanations

            - codeSnippets:
            - Include ONLY if code is required for this task
            - Each snippet must be minimal and directly usable
            - Do NOT include full files or large blocks
            - Use the appropriate language for the task

            - commonMistakes:
            - List common beginner mistakes related to THIS task only
            - Avoid generic mistakes

            - verification:
            - Describe ONE simple way the user can confirm the task is done correctly
            - Must be concrete and observable

            TASK CONTEXT:

            Project Description: ${projectDescription}

            Task Title: ${taskTitle}

            Task Description: ${taskDescription}

            Return ONLY the JSON object.
            Do not include any other text.`,
  });

  const raw =
    response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    response?.text?.trim() ||
    "";
  const jsonText = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(jsonText);
}

module.exports = generateGuidance;