const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if(!geminiApiKey){
    console.log("No gemini api key present");
    return;
}

const ai = new GoogleGenAI({apiKey: geminiApiKey});

async function generateTask(projdesc){
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `This is the project description: ${projdesc}, generate a list of tasks in order to complete this project and each task should have- title, description, phase[foundation/core/advanced], difficulty level[easy,medium,hard], estimatedTime[human readable string e.g. "10-15 minutes", "~1 hour"]`
    });

    console.log(response.text);
};

generateTask("Create a todo app using MERN stack");