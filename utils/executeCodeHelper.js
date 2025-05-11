/*
    Helper file to file: utils/executeCode.js

*/

//Imports
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs'; // java specific import

// Recommendation from ChatGPT: Promisify exec to use async/await
// Purpose: exec is the library that helps "execute" the code at a low level
// Reason: Makes it easier to AWAIT output executed from exec. Allows us to use words like async and await
const execAsync = promisify(exec);

//Actual method implementation
export default async function executeCodeHelper(inputCode, language, stdin) {
    try {
        // Call the compileCode method to compile the code
        let { codeCommand, warnings } = await compileCode(inputCode, language, stdin);

        // Execute the input command
        let { stdout, stderr } = await execAsync(codeCommand);

        // Construct the result object
        let result = { output: stdout}; // Include warnings in the result

        // Handle any warnings if any
        if (warnings){
            result.warnings = warnings;
        }

        // Handle errors if any
        if (stderr) {
            result.error = stderr; // Assign the error if it exists
        }
        return result
    } 
    
    catch (error) {
        // Handle any errors that occur during execution
        return { output: null, error: error.message };
    }

}

/*
    Docstring for regexCleaningInput

    Helper method to compileCode

    Purpose: Taking a string, and using regex to clean up the string contents for POST endpoint execution. 
    Using regex, the following cleaning is done:

        1. Escaping double quotes 
        2. Escaping single quotes
        3. Escaping newlines 
        4. Getting rid of trailing and leading whitespace
*/

function regexCleaningInput(language, inputString){
    // Note: Using the optional chaining operator (?.) to safely handle cases where inputString is null
    //FIXME: One massive assumption: We assume all lines of code are escaped by a \n, therefore the regex does NOT escape them
    //FIXME: Likely need to work on further refining the regex
    
    if (language === "python" || language === "javascript"){
        let cleanedInputString = inputString
        ?.replace(/\\/g, '\\\\') // Escape backslashes
        ?.replace(/"/g, '\\"') // Escape double quotes
        ?.replace(/'/g, "\\'") // Escape single quotes
        ?.trim(); // Trim any leading or trailing whitespace
        return cleanedInputString;
    }

    else if (language === "java" || language === "c" || language === "c++"){
        let cleanedInputString = inputString
        ?.replace(/'/g, "\\'") // Escape single quotes
        ?.trim(); // Trim any leading or trailing whitespace
        return cleanedInputString;
    }
}

/*
    Function to delete any temporary generated files for code execution.
    Used for the following languages:
        - Java 
        - C
        - C++
*/
export async function cleanUpTempCodeFiles(inputCode, language){
    if (language === "java"){
        let cleanedInputCode = regexCleaningInput(language, inputCode);
        let findingJavaClassName = cleanedInputCode.match(/public\s+class\s+(\w+)/);
        let tempJavaFileName = findingJavaClassName[1];
        try {
            await execAsync(`rm ${tempJavaFileName}.java`);
            await execAsync(`rm ${tempJavaFileName}.class`);
        } catch (error) {
            console.error("Error deleting the temporary Java file and class:", error);
        }     
    }
    else if (language === "c"){
        const tempCFileName = "tempCFile"
        try {
            await execAsync(`rm ${tempCFileName}.c`);
            await execAsync(`rm ${tempCFileName}`);
        } catch (error) {
            console.error("Error deleting the temporary C file and executable:", error);
        }     
    }
    else if (language === "c++"){
        const tempCFileName = "tempCppFile"
        try {
            await execAsync(`rm ${tempCFileName}.cpp`);
            await execAsync(`rm ${tempCFileName}`);
        } catch (error) {
            console.error("Error deleting the temporary C++ file and executable:", error);
        }   
    }
}


/*
    Helper method to executeCodeHelper (compileCode)

    This method handles the compilation of code in 2 different cases

    Case A:
        Languages: Python, Javascript (via Node.js)

        These languages are interpreted, meaning that we don't need to make a temp file and execute them
        The idea is to execute stuff in <inputCode> as a string

    Case B:
        Languages: Java, C, C++

        These languages need to be compiled, so the steps for execution are: 
            1. Create a temporary file containin <inputCode>
            2. Compile this file
            3. [NOT IN THIS METHOD, LATER ON]: Delete this file
    
    TODOS:
        1. Handle user input (either here or in executeCodeHelper)
        2. Implement support for JS (similar to Python)
        3. Think about how to implement for all languages in category B (Java, C, C++ )
*/
async function compileCode (inputCode, language, stdin){

    // Defining a variable to store the command to compile the code
    let codeCommand;
    // Defining a variable to store warnings. Note: This variable would always be "" for languages "python" and "javascript"
    let warnings = ""; 

    // Creating a regex pattern to clean up input code. (Reference: ChatGPT)
    let cleanedInputCode = regexCleaningInput(language, inputCode);
    let cleanedStdin = regexCleaningInput(language, stdin);

    if (language === "python"){
        // the -c command tells python to execute inputCode as a string not a file
        // Futhermore, need to put "" around the template literal (${}) to make it interpret as a string
        // codeCommand = `python3 -c "${cleanedInputCode}"`; 
        codeCommand = `echo "${cleanedStdin}" | python3 -c "${cleanedInputCode}"`
    }
    else if (language === "javascript"){
        // We use node.js to run javascript commands
        // The "-e" flag, like how -c is used for python, tells node.js to execute the command 
        codeCommand = `echo "${cleanedStdin}" | node -e "${cleanedInputCode}"`; 
    }
    else if (language === "java"){
        // Unlike Python and JS, Java is a compiled language
        // Therefore, we need to write the code to another temporary file and compile that file to have it execute

        //FIXME: Need to review whether this assumption holds true
        // Need to extract the class name from the file so that we can name the temporary file the same
        // NOT matching the names will lead to errors like : "error: class HelloWorld is public, should be declared in a file named HelloWorld.java"
        let findingJavaClassName = cleanedInputCode.match(/public\s+class\s+(\w+)/);
        let tempJavaFileName = findingJavaClassName[1];

        // Write the code to a temporary file
        //using writeFileSync as this is async function => forces program to wait for input code to be written
        
        fs.writeFileSync(`${tempJavaFileName}.java`, cleanedInputCode);

        //Compile that file (to a .class)
        //FIXME: Includign -Xlint:unchecked as we might need to this to have warnings displayed
        const { stderr } = await execAsync(`javac -Xlint:unchecked ${tempJavaFileName}.java`);
        warnings = stderr; // Store warnings from compilation

        //Execute the code found in this class file + with user args
        codeCommand = `echo "${cleanedStdin}" | java ${tempJavaFileName}`;
    }
    else if (language === "c"){
        // Like Java, we need to compile all code written in c into a temporary file (that later gets deleted)
        const tempCFileName = "tempCFile"
        // Write the code to a temporary file
        fs.writeFileSync(`${tempCFileName}.c`, cleanedInputCode);
        //Compile that code into an executable
        // FIXME: Note: From CSC209, the -Wall and the -Wextra flags allow warnigns to be displayed
        const { stderr } = await execAsync(`gcc -Wall -Wextra ${tempCFileName}.c -o ${tempCFileName}`);
        warnings = stderr; // Store warnings from compilation
        //Execute the code found in the temporary file + with user args
        codeCommand = `echo "${cleanedStdin}" | ./${tempCFileName}`;

    }
    else if (language === "c++") {
        // Like Java, we need to compile all code written in C++ into a temporary file (that later gets deleted)
        const tempCppFileName = "tempCppFile";
        // Write the code to a temporary file
        fs.writeFileSync(`${tempCppFileName}.cpp`, cleanedInputCode);
        // Compile that code into an executable
        // Note: The -Wall and -Wextra flags allow warnings to be displayed
        const { stderr } = await execAsync(`g++ -Wall -Wextra ${tempCppFileName}.cpp -o ${tempCppFileName}`);
        warnings = stderr; // Store warnings from compilation
        // Execute the code found in the temporary file + with user args
        codeCommand = `echo "${cleanedStdin}" | ./${tempCppFileName}`;
    }
    // Note: At least 1 of these else branches should be reached because the language validity check...
    //... is already done in method executingCode under file: executeCode.js
    return { codeCommand, warnings }
}