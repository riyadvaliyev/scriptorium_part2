/*
    User story to satisfy:

        1. As a visitor, I want to execute my code on Scriptorium and see the output in real-time so that I can quickly verify its correctness.


    Assumptions:

    From Piazza note @220, just assume that ALL the user input is given in 1 go
    Ie: Thinking of the program running as: You give it all the input at once, and it gives you all the output at once
    
    
    Note:

        - Did not put this in a nested folder (eg: user or admin) because this route is accessible to all (accesible to the lowest level, visitor)

    Used ChatGPT as brainstorming inspiration and for helped to structure the code + error handling

*/

//Imports
import executeCodeHelper from '../../utils/executeCodeHelper'; // TODO: Double-check import path
import { cleanUpTempCodeFiles } from '../../utils/executeCodeHelper'; // TODO: Double-check import path

//Handler
export default async function handler(req, res) {
    // Checking if request type is correct
    if (req.method != "POST") {
        return res.status(405).json({ error: "Method not supported" });
    }

    // Get POST body content
    const { inputCode, language, stdin } = req.body;

    // Use the helper function to process the code execution
    const result = await executingCode(inputCode, language, stdin);

    // Handle the response based on the helper function's result
    if (result.error) {
        return res.status(400).json(result); // Return the result directly (no nested object)
    }

    return res.status(200).json(result); // Return the result directly (no nested object)
}

// Creating a new function that pulls out some of the existing handler code
export async function executingCode(inputCode, language, stdin) {
    // Define a set of supported languages
    const setOfSupportedLanguages = new Set(["c", "c++", "java", "python", "javascript", 
        "ruby", "r", "rust"]);

    // Check if required fields are defined 
    if (!inputCode || !language) {
        return { error: "Missing input code or language" };
    }

    // Checking if the language is in setOfSupportedLanguages
    if (!setOfSupportedLanguages.has(language)) {
        return { error: "Unsupported language" };
    }

    // Trying to execute the code
    try {
        const codeOutput = await executeCodeHelper(inputCode, language, stdin);
        if (language === "java" || language === "c" || language === "c++"
            || language === "rust") {
            await cleanUpTempCodeFiles(inputCode, language);
        }
        return codeOutput; // Directly return the result from executeCodeHelper
    } catch (error) {
        return { error: "Error encountered when executing code" };
    }
}