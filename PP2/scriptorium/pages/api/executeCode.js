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
// import { exec } from 'child_process';
// import { promisify } from 'util';
// import fs from 'fs';
// import path from 'path';
import executeCodeHelper from '../../utils/executeCodeHelper'; //TODO: Double check if import path is correct
import { cleanUpTempCodeFiles } from '../../utils/executeCodeHelper'; //TODO: Double check if import path is correct

//Handler
export default async function handler(req, res){

    // Checking if request type is correct
    if (req.method != "POST"){
        return res.status(405).json({error: "Method not supported"});
    }

    // Get POST body content
    const {inputCode, language, stdin} = req.body;
    // Use the helper function to process the code execution
    const result = await executingCode(inputCode, language, stdin);

    // Handle the response based on the helper function's result
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    
    return res.status(200).json(result.output);

    // //TODO: Refactor the code from line 39 onward (as a new method, exportable)
    // await executeCodeHelper(inputCode,language, stdin, res);

    // // Define a set of supported languages
    // const setOfSupportedLanguages = new Set(["c", "c++", "java", "python", "javascript"]);

    // // Check if required fields are defined 
    // // Here, assume required fields are: inputCode and language
    // if (!inputCode || !language){
    //     return res.status(400).json({message: "Missing input code or language"});
    // }

    // // Checking if the language is in setOfSupportedLanguages
    // if (!setOfSupportedLanguages.has(language)){
    //     return res.status(400).json({message: "Unsupported language"});
    // }

    // //Trying to execute the code
    // try {
    //     const codeOutput = await executeCodeHelper(inputCode, language, stdin);
    //     if (language === "java" || language === "c" || language === "c++"){
    //         await cleanUpTempCodeFiles(inputCode, language);
    //     }
    //     res.status(200).json(codeOutput); //TODO: Might need to change this output format depending on implementation of executeCodeHelper
    // } catch (error){
    //     // console.error("Error executing code:", error); // For debugging purposes
    //     return res.status(500).json({ error: "Failed to execute code" });
    // }   
}

// Creating a new function that pulls out some of the existing handler code
export async function executingCode(inputCode, language, stdin){
     // Define a set of supported languages
     const setOfSupportedLanguages = new Set(["c", "c++", "java", "python", "javascript"]);

     // Check if required fields are defined 
     // Here, assume required fields are: inputCode and language
     if (!inputCode || !language){
         return {error: "Missing input code or language"};
     }
 
     // Checking if the language is in setOfSupportedLanguages
     if (!setOfSupportedLanguages.has(language)){
         return {error: "Unsupported language"};
     }
 
     //Trying to execute the code
     try {
         const codeOutput = await executeCodeHelper(inputCode, language, stdin);
         if (language === "java" || language === "c" || language === "c++"){
             await cleanUpTempCodeFiles(inputCode, language);
         }
        return { output: codeOutput };
     } catch (error){
         return { error: "Error encountered when executing code" };
     }   

}