const { GoogleGenAI } = require("@google/genai");

const geminiApiKey = process.env.GEMINI_API_KEY;
if(!geminiApiKey){
    console.log("No gemini api key present");
    return;
}

const ai = new GoogleGenAI({apiKey: geminiApiKey});

async function generateTask(projdesc){
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `This is the project description: ${projdesc}. 
        
        Generate a list of tasks to complete this project. Return ONLY valid JSON array without any markdown formatting or code blocks.

        Each task should have:
        - title (string)
        - description (string)
        - phase (string: "FOUNDATION", "CORE", or "ADVANCED")
        - difficulty (string: "Easy", "Medium", or "Hard")
        - estimatedTime (string: e.g., "10-15 minutes", "~1 hour")
        - completed (boolean: false)

        Example format:
        [
        {
            "title": "Setup project",
            "description": "Initialize project with necessary files",
            "phase": "FOUNDATION",
            "difficulty": "Easy",
            "estimatedTime": "30 minutes",
            "completed": false
        }
        ]`,
    });

    let jsonText = response.text.trim();
// Removes markdown code block formatting that Gemini sometimes adds
// First replace: /```json\n?/g - Removes "```json" and optional newline
// Second replace: /```\n?/g - Removes closing "```" and optional newline
// g flag means "global" - replace all occurrences
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // convert string to js object
    const tasks = JSON.parse(jsonText);
    return tasks;
};

// (async () => {
//     try{
//         const tasks = await generateTask("Create a todo app using MERN stack");
//         console.log("Tasks Length: ", tasks.length);
//         console.log(tasks);
//     }catch(err){
//         console.error("Error: ",err.message);
//     }
// })();
module.exports=generateTask;