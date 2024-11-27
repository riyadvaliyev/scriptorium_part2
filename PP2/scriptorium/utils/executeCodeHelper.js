/*
    Helper file to file: utils/executeCode.js

*/

//FIXME: THIS IS THE START OF THE NEW DOCKER VERSION OF THE FILE
//Imports
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs'; // java specific import

// Recommendation from ChatGPT: Promisify exec to use async/await
// Purpose: exec is the library that helps "execute" the code at a low level
// Reason: Makes it easier to AWAIT output executed from exec. Allows us to use words like async and await
const execAsync = promisify(exec);

// Helper method to check whether the inputCode contains any directory commands
function containsProhibitedCommands(inputString) {
    // Define prohibited commands regex
    const prohibitedCommands = /\b(ls|cd|pwd|rm|rmdir|mv|shutdown|reboot|kill|chown|chmod)\b/g;

    // Find all matches for prohibited commands
    const matches = inputString.match(prohibitedCommands);

    // Return an object with a flag and the matches
    return {
        hasProhibitedCommands: matches !== null,
        flaggedCommands: matches || [] // Return an empty array if no matches are found
    };
}



//Actual code executer helper method execution
export default async function executeCodeHelper(inputCode, language, stdin) {
    try {
            
        // Adding an additional regex check to "block" off any directory or file changing commands
        // This is for isolation (to ensure that the user cannot maliciosly delete stuff in the container)
        let prohibitedCommandsMatchResult = containsProhibitedCommands(inputCode);
        if (prohibitedCommandsMatchResult.hasProhibitedCommands){
            let result = {}
            result.error = "You cannot use these commands: " + prohibitedCommandsMatchResult.flaggedCommands.join(", ");
            return result;
        }

        // Call the compileCode method to compile the code
        let { codeCommand, warnings } = await dockerCompileCode(inputCode, language, stdin);

        // TODO: New changes based on the docker isolation changes
        let { stdout, stderr } = await execAsync(codeCommand);

        // Construct the result object (initialize as empty object)
        let result = {}

        // Include stdout if included
        if (stdout) {
            result.output = stdout;
        }

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
        return {error: error.message };
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
        //?.replace(/'/g, "\\'") // Escape single quotes
        ?.trim(); // Trim any leading or trailing whitespace
        return cleanedInputString;
    }

    else if (language === "java"){
        let cleanedInputString = inputString
        ?.replace(/'/g, "\\'") // Escape single quotes
        ?.replace(/"/g, '\\"') // Escape double quotes
        ?.trim(); // Trim any leading or trailing whitespace
        return cleanedInputString;
    }

    else if (language === "c" || language === "c++"){
        let cleanedInputString = inputString
        ?.replace(/'/g, "\\'") // Escape single quotes
        ?.trim(); // Trim any leading or trailing whitespace
        return cleanedInputString;
    }

    else if (language === "ruby") {
        let cleanedInputString = inputString
        ?.replace(/\\/g, '\\\\')   // Escape backslashes for JSON
        ?.replace(/"/g, '\\"')     // Escape double quotes for JSON
        ?.trim();                 // Trim any leading/trailing whitespace
        return cleanedInputString;
    }

    else if (language === "r"){
        let cleanedInputString = inputString
        ?.replace(/\\/g, '\\\\')   // Escape backslashes
        ?.replace(/"/g, '\\"')      // Escape double quotes
        ?.replace(/\$/g, '\\$')        // Escape dollar signs
        ?.trim();                  // Trim leading/trailing whitespace
        return cleanedInputString
    }

    // TODO: Check whether rust truly doesn't need escape characters
    else if (language === "rust") {
        let cleanedInputString = inputString
            // Trim leading/trailing whitespace
            ?.trim();                  
        
        return cleanedInputString;
    }
    else if (language === "go") {
        let cleanedInputString = inputString
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
    if (language === "java") {
        let cleanedInputCode = regexCleaningInput(language, inputCode);
        let findingJavaClassName = cleanedInputCode.match(/public\s+class\s+(\w+)/);
        let tempJavaFileName = findingJavaClassName[1];
        
        try {
            // Remove both the .java and .class files inside the container
            await execAsync(`docker exec -u root -i java_container rm /tmp/${tempJavaFileName}.java`);
            await execAsync(`docker exec -u root -i java_container rm /tmp/${tempJavaFileName}.class`);
        } catch (error) {
            console.error("Error deleting the temporary Java file and class:", error);
        }
    }    
    else if (language === "c") {
        let tempCFileName = "tempCFile";  // Adjust to your desired temporary C file name
        
        try {
            // Remove both the .c source file and the compiled executable inside the container
            await execAsync(`docker exec -u root -i c_container rm /tmp/${tempCFileName}.c`);
            await execAsync(`docker exec -u root -i c_container rm /tmp/${tempCFileName}`);
        } catch (error) {
            console.error("Error deleting the temporary C file and executable:", error);
        }
    }
    else if (language === "c++") {
        const tempCppFileName = "tempCppFile";  // Temporary file name for C++ code
    
        try {
            // Remove both the .cpp source file and the compiled executable inside the container
            await execAsync(`docker exec -u root -i cpp_container rm -f /tmp/${tempCppFileName}.cpp`);
            await execAsync(`docker exec -u root -i cpp_container rm -f /tmp/${tempCppFileName}`);
        } catch (error) {
            console.error("Error deleting the temporary C++ file and executable:", error);
        }
    }
    
    else if (language === "rust"){
        const tempRustFileName = "tempRustFile"
        try {
            await execAsync(`docker exec -u root -i rust_container rm -f /tmp/${tempRustFileName}.rs`);
            await execAsync(`docker exec -u root -i rust_container rm -f /tmp/${tempRustFileName}`);
        } catch (error) {
            console.error("Error deleting the temporary Rust file and executable:", error);
        }  
    }
    else if (language === "go"){
        const tempGoFileName = "tempGoFile"
        try {
            await execAsync(`docker exec -u root -i go_container rm -f /tmp/${tempGoFileName}.go`);
            await execAsync(`docker exec -u root -i go_container rm -f /tmp/${tempGoFileName}`);
        } catch (error) {
            console.error("Error deleting the temporary Rust file and executable:", error);
        }  
    }
}

// Helper method to generate the Docker execution command
async function dockerCompileCode(inputCode, language, stdin) {
    // Defining a variable to store the command to compile the code
    let codeCommand;
    // Defining a variable to store warnings. Note: This variable would always be "" for languages "python" and "javascript"
    let warnings = ""; 

    // Creating a regex pattern to clean up input code. (Reference: ChatGPT)
    let cleanedInputCode = regexCleaningInput(language, inputCode);
    let cleanedStdin = regexCleaningInput(language, stdin);

    // Determine the image name based on the language
    // TODO: Probably don't need to check for invalid language (already done in executeCode.js)
    let containerName;
    if (language === "python") {
        containerName = "python_container"; 
    } 
    else if (language === "javascript") {
        containerName = "javascript_container"; 
    }
    else if (language === "java"){
        containerName = "java_container";
    }
    else if (language === "c"){
        containerName = "c_container";
    }
    else if (language === "c++"){
        containerName = "cpp_container";
    }
    else if (language === "ruby"){
        containerName = "ruby_container";
    }
    else if (language === "rust"){
        containerName = "rust_container";
    }
    else if (language === "go"){
        containerName = "go_container";
    }
    else if (language === "r"){
        containerName = "r_container";
    }
    
    // Determine the docker execution command to run
    if (language === "python"){
        // the -c command tells python to execute inputCode as a string not a file
        // Futhermore, need to put "" around the template literal (${}) to make it interpret as a string
        // codeCommand = `echo "${cleanedStdin}" | docker exec -i python_container python3 -c "${cleanedInputCode}"`;
        codeCommand = `docker exec -i '${containerName}' bash -c "echo '${cleanedStdin}' | timeout --signal=SIGKILL 20s python3 -c '${cleanedInputCode}'"`;
    }
    else if (language === "javascript"){
        // We use node.js to run javascript commands
        // The "-e" flag, like how -c is used for python, tells node.js to execute the command 
        // codeCommand = `echo "${cleanedStdin}" | docker run --rm -i ${imageName} node -e "${cleanedInputCode}"`; 
        // codeCommand = `echo "${cleanedStdin}" | docker exec -i javascript_container node -e "${cleanedInputCode}"`;
        codeCommand = `docker exec -i '${containerName}' bash -c "echo '${cleanedStdin}' | timeout --signal=SIGKILL 20s node -e '${cleanedInputCode}'"`;
    }

    else if (language === "java"){
        // Extract Java class name (assuming class is named in the public class definition)
        let findingJavaClassName = cleanedInputCode.match(/public\s+class\s+(\w+)/);
        let tempJavaFileName = findingJavaClassName[1];

        // Write the Java code to a temporary file inside the container
        await execAsync(`docker exec -i '${containerName}' bash -c 'echo "${cleanedInputCode}" > /tmp/${tempJavaFileName}.java'`);

        // Compile the Java code inside the container
        // We use -Xlint:unchecked to show warnings (if any)
        const { stderr } = await execAsync(`docker exec -i '${containerName}' javac -Xlint:unchecked /tmp/${tempJavaFileName}.java`);
        warnings = stderr; // Store any compilation warnings

        // Run the Java code (passing stdin via echo)
        // codeCommand = `echo "${cleanedStdin}" | docker exec -i java_container java -cp /tmp ${tempJavaFileName}`;
        codeCommand = `docker exec -i '${containerName}' bash -c "echo '${cleanedStdin}' | timeout --signal=SIGKILL 20s java -cp /tmp ${tempJavaFileName}"`;

    }
    else if (language === "c") {
        const tempCFileName = "tempCFile";
        const tempCFilePath = `/tmp/${tempCFileName}.c`;
    
        // Write the C code to a local temporary file
        fs.writeFileSync(tempCFilePath, cleanedInputCode);
    
        // Copy the file to the Docker container
        await execAsync(`docker cp ${tempCFilePath} '${containerName}':/tmp/${tempCFileName}.c`);
    
        // Compile the C code inside the container
        const { stderr } = await execAsync(`docker exec -i '${containerName}' gcc -Wall -Wextra /tmp/${tempCFileName}.c -o /tmp/${tempCFileName}`);
        warnings = stderr; // Compilation warnings

        codeCommand = `echo '${cleanedStdin}' | docker exec -i '${containerName}' timeout --signal=SIGKILL 20s sh -c '/tmp/${tempCFileName}'`;

    }
    else if (language === "c++") {
        const tempCppFileName = "tempCppFile";
        const tempCppFilePath = `/tmp/${tempCppFileName}.cpp`;
    
        // Write the C++ code to a local temporary file
        fs.writeFileSync(tempCppFilePath, cleanedInputCode);
    
        // Copy the file to the Docker container
        await execAsync(`docker cp ${tempCppFilePath} '${containerName}':/tmp/${tempCppFileName}.cpp`);
    
        // Compile the C++ code inside the container
        const { stderr } = await execAsync(`docker exec -i '${containerName}' g++ -Wall -Wextra /tmp/${tempCppFileName}.cpp -o /tmp/${tempCppFileName}`);
        warnings = stderr;
    
        // Run the compiled C++ code with a timeout of 20 seconds
        codeCommand = `echo '${cleanedStdin}' | docker exec -i '${containerName}' timeout --signal=SIGKILL 20s sh -c '/tmp/${tempCppFileName}'`;
    }
    else if (language === "ruby") {
        // Ruby is an interpreted language (like Python), so no need to compile
        // The -e flag tells Ruby to execute the input code as a string
        // Using timeout to limit execution time and echo for stdin handling
        codeCommand = `docker exec -i '${containerName}' bash -c "echo '${cleanedStdin}' | timeout --signal=SIGKILL 20s ruby -w -e '${cleanedInputCode}'"`;
    }
    else if (language === "rust") {
        const tempRustFileName = "tempRustFile";  // Name for the Rust source file (without .rs)
        const tempRustFilePath = `/tmp/${tempRustFileName}.rs`; // Correct file path for the source file
    
        // Write the cleaned input code to a temporary Rust file
        fs.writeFileSync(tempRustFilePath, cleanedInputCode);
    
        // Copy the file to the Docker container
        await execAsync(`docker cp ${tempRustFilePath} '${containerName}':/tmp/${tempRustFileName}.rs`);
    
        // Compile the Rust code inside the container and specify the output executable
        const { stderr } = await execAsync(`docker exec -i '${containerName}' rustc /tmp/${tempRustFileName}.rs -o /tmp/${tempRustFileName}`);
    
        // Capture any compilation warnings
        warnings = stderr;
    
        // Run the compiled Rust executable inside the container
        codeCommand = `echo '${cleanedStdin}' | docker exec -i '${containerName}' timeout --signal=SIGKILL 20s sh -c '/tmp/${tempRustFileName}'`;
    }
    else if (language === "go") {
        const tempGoFileName = "tempGoFile";
        const tempGoFilePath = `/tmp/${tempGoFileName}.go`;
    
        // Write the cleaned input code to the Go file
        fs.writeFileSync(tempGoFilePath, cleanedInputCode);
    
        // Copy the file to the Docker container
        await execAsync(`docker cp ${tempGoFilePath} '${containerName}':/tmp/${tempGoFileName}.go`);

        // Compile the Go code inside the container and specify the output executable
        const { stderr } = await execAsync(`docker exec -i 'go_container' go build -o /tmp/${tempGoFileName} /tmp/${tempGoFileName}.go`);

        // Capture any compilation warnings
        warnings = stderr;
    
        // Command to run the code with stdin handling
        codeCommand = `echo '${cleanedStdin}' | docker exec -i '${containerName}' timeout --signal=SIGKILL 20s sh -c '/tmp/${tempGoFileName}'`;
    }
    else if (language === "r"){
        codeCommand = `echo "${cleanedStdin}" | docker exec -i '${containerName}' Rscript -e "${cleanedInputCode}"`;
    }
    return { codeCommand, warnings }

}




// //FIXME: THIS IS THE START OF THE OLD PRE-DOCKER VERSION OF THE CODE
// //Imports
// import { exec } from 'child_process';
// import { promisify } from 'util';
// import fs from 'fs'; // java specific import

// // Recommendation from ChatGPT: Promisify exec to use async/await
// // Purpose: exec is the library that helps "execute" the code at a low level
// // Reason: Makes it easier to AWAIT output executed from exec. Allows us to use words like async and await
// const execAsync = promisify(exec);

// //Actual code executer helper method execution
// export default async function executeCodeHelper(inputCode, language, stdin) {
//     try {
//         // Call the compileCode method to compile the code
//         let { codeCommand, warnings } = await compileCode(inputCode, language, stdin);

//         // TODO: New changes based on the docker isolation changes
//         let { stdout, stderr } = await execAsync(codeCommand);

//         // // Execute the input command
//         // let { stdout, stderr } = await execAsync(codeCommand);

//         // Construct the result object (initialize as empty object)
//         let result = {}

//         // Include stdout if included
//         if (stdout) {
//             result.output = stdout;
//         }

//         // Handle any warnings if any
//         if (warnings){
//             result.warnings = warnings;
//         }

//         // Handle errors if any
//         if (stderr) {
//             result.error = stderr; // Assign the error if it exists
//         }
//         return result
//     } 
    
//     catch (error) {
//         // Handle any errors that occur during execution
//         return {error: error.message };
//     }

// }

// /*
//     Docstring for regexCleaningInput

//     Helper method to compileCode

//     Purpose: Taking a string, and using regex to clean up the string contents for POST endpoint execution. 
//     Using regex, the following cleaning is done:

//         1. Escaping double quotes 
//         2. Escaping single quotes
//         3. Escaping newlines 
//         4. Getting rid of trailing and leading whitespace
// */

// function regexCleaningInput(language, inputString){
//     // Note: Using the optional chaining operator (?.) to safely handle cases where inputString is null
//     //FIXME: One massive assumption: We assume all lines of code are escaped by a \n, therefore the regex does NOT escape them
//     //FIXME: Likely need to work on further refining the regex
    
//     if (language === "python" || language === "javascript"){
//         let cleanedInputString = inputString
//         ?.replace(/\\/g, '\\\\') // Escape backslashes
//         ?.replace(/"/g, '\\"') // Escape double quotes
//         //?.replace(/'/g, "\\'") // Escape single quotes
//         ?.trim(); // Trim any leading or trailing whitespace
//         return cleanedInputString;
//     }

//     else if (language === "java" || language === "c" || language === "c++"){
//         let cleanedInputString = inputString
//         ?.replace(/'/g, "\\'") // Escape single quotes
//         ?.trim(); // Trim any leading or trailing whitespace
//         return cleanedInputString;
//     }

//     else if (language === "ruby") {
//         let cleanedInputString = inputString
//         ?.replace(/\\/g, '\\\\')   // Escape backslashes for JSON
//         ?.replace(/"/g, '\\"')     // Escape double quotes for JSON
//         ?.trim();                 // Trim any leading/trailing whitespace
//         return cleanedInputString;
//     }

//     else if (language === "r"){
//         let cleanedInputString = inputString
//         ?.replace(/\\/g, '\\\\')   // Escape backslashes
//         ?.replace(/"/g, '\\"')      // Escape double quotes
//         ?.replace(/\$/g, '\\$')        // Escape dollar signs
//         ?.trim();                  // Trim leading/trailing whitespace
//         return cleanedInputString
//     }

//     // TODO: Check whether rust truly doesn't need escape characters
//     else if (language === "rust") {
//         let cleanedInputString = inputString
//             // Trim leading/trailing whitespace
//             .trim();                  
        
//         return cleanedInputString;
//     }
    
    
// }

// /*
//     Function to delete any temporary generated files for code execution.
//     Used for the following languages:
//         - Java 
//         - C
//         - C++
// */
// export async function cleanUpTempCodeFiles(inputCode, language){
//     if (language === "java"){
//         let cleanedInputCode = regexCleaningInput(language, inputCode);
//         let findingJavaClassName = cleanedInputCode.match(/public\s+class\s+(\w+)/);
//         let tempJavaFileName = findingJavaClassName[1];
//         try {
//             await execAsync(`rm ${tempJavaFileName}.java`);
//             await execAsync(`rm ${tempJavaFileName}.class`);
//         } catch (error) {
//             console.error("Error deleting the temporary Java file and class:", error);
//         }     
//     }
//     else if (language === "c"){
//         const tempCFileName = "tempCFile"
//         try {
//             await execAsync(`rm ${tempCFileName}.c`);
//             await execAsync(`rm ${tempCFileName}`);
//         } catch (error) {
//             console.error("Error deleting the temporary C file and executable:", error);
//         }     
//     }
//     else if (language === "c++"){
//         const tempCFileName = "tempCppFile"
//         try {
//             await execAsync(`rm ${tempCFileName}.cpp`);
//             await execAsync(`rm ${tempCFileName}`);
//         } catch (error) {
//             console.error("Error deleting the temporary C++ file and executable:", error);
//         }   
//     }
//     else if (language === "rust"){
//         const tempCFileName = "tempRustFile"
//         try {
//             await execAsync(`rm ${tempCFileName}.rs`);
//             await execAsync(`rm ${tempCFileName}`);
//         } catch (error) {
//             console.error("Error deleting the temporary Rust file and executable:", error);
//         }  
//     }
// }


// /*
//     Helper method to executeCodeHelper (compileCode)

//     This method handles the compilation of code in 2 different cases

//     Case A:
//         Languages: Python, Javascript (via Node.js)

//         These languages are interpreted, meaning that we don't need to make a temp file and execute them
//         The idea is to execute stuff in <inputCode> as a string

//     Case B:
//         Languages: Java, C, C++

//         These languages need to be compiled, so the steps for execution are: 
//             1. Create a temporary file containin <inputCode>
//             2. Compile this file
//             3. [NOT IN THIS METHOD, LATER ON]: Delete this file
    
//     TODOS:
//         1. Handle user input (either here or in executeCodeHelper)
//         2. Implement support for JS (similar to Python)
//         3. Think about how to implement for all languages in category B (Java, C, C++ )
// */
// async function compileCode (inputCode, language, stdin){

//     // Defining a variable to store the command to compile the code
//     let codeCommand;
//     // Defining a variable to store warnings. Note: This variable would always be "" for languages "python" and "javascript"
//     let warnings = ""; 

//     // Creating a regex pattern to clean up input code. (Reference: ChatGPT)
//     let cleanedInputCode = regexCleaningInput(language, inputCode);
//     let cleanedStdin = regexCleaningInput(language, stdin);

//     if (language === "python"){
//         // the -c command tells python to execute inputCode as a string not a file
//         // Futhermore, need to put "" around the template literal (${}) to make it interpret as a string
//         // codeCommand = `python3 -c "${cleanedInputCode}"`; 
//         codeCommand = `echo "${cleanedStdin}" | python3 -c "${cleanedInputCode}"`
//     }
//     else if (language === "javascript"){
//         // We use node.js to run javascript commands
//         // The "-e" flag, like how -c is used for python, tells node.js to execute the command 
//         codeCommand = `echo "${cleanedStdin}" | node -e "${cleanedInputCode}"`; 
//     }
//     else if (language === "java"){
//         // Unlike Python and JS, Java is a compiled language
//         // Therefore, we need to write the code to another temporary file and compile that file to have it execute

//         //FIXME: Need to review whether this assumption holds true
//         // Need to extract the class name from the file so that we can name the temporary file the same
//         // NOT matching the names will lead to errors like : "error: class HelloWorld is public, should be declared in a file named HelloWorld.java"
//         let findingJavaClassName = cleanedInputCode.match(/public\s+class\s+(\w+)/);
//         let tempJavaFileName = findingJavaClassName[1];

//         // Write the code to a temporary file
//         //using writeFileSync as this is async function => forces program to wait for input code to be written
        
//         fs.writeFileSync(`${tempJavaFileName}.java`, cleanedInputCode);

//         //Compile that file (to a .class)
//         //FIXME: Includign -Xlint:unchecked as we might need to this to have warnings displayed
//         const { stderr } = await execAsync(`javac -Xlint:unchecked ${tempJavaFileName}.java`);
//         warnings = stderr; // Store warnings from compilation

//         //Execute the code found in this class file + with user args
//         codeCommand = `echo "${cleanedStdin}" | java ${tempJavaFileName}`;
//     }
//     else if (language === "c"){
//         // Like Java, we need to compile all code written in c into a temporary file (that later gets deleted)
//         const tempCFileName = "tempCFile"
//         // Write the code to a temporary file
//         fs.writeFileSync(`${tempCFileName}.c`, cleanedInputCode);
//         //Compile that code into an executable
//         // FIXME: Note: From CSC209, the -Wall and the -Wextra flags allow warnigns to be displayed
//         const { stderr } = await execAsync(`gcc -Wall -Wextra ${tempCFileName}.c -o ${tempCFileName}`);
//         warnings = stderr; // Store warnings from compilation
//         //Execute the code found in the temporary file + with user args
//         codeCommand = `echo "${cleanedStdin}" | ./${tempCFileName}`;

//     }
//     else if (language === "c++") {
//         // Like Java, we need to compile all code written in C++ into a temporary file (that later gets deleted)
//         const tempCppFileName = "tempCppFile";
//         // Write the code to a temporary file
//         fs.writeFileSync(`${tempCppFileName}.cpp`, cleanedInputCode);
//         // Compile that code into an executable
//         // Note: The -Wall and -Wextra flags allow warnings to be displayed
//         const { stderr } = await execAsync(`g++ -Wall -Wextra ${tempCppFileName}.cpp -o ${tempCppFileName}`);
//         warnings = stderr; // Store warnings from compilation
//         // Execute the code found in the temporary file + with user args
//         codeCommand = `echo "${cleanedStdin}" | ./${tempCppFileName}`;
//     }
//     else if (language === "ruby") {
//         // Ruby is an interpreted language (like Python, JS), so no need to compile
//         // Using the -w flag to enable warnings
//         codeCommand = `echo "${cleanedStdin}" | ruby -w -e "${cleanedInputCode}"`;
//     }
//     else if (language === "r") {
//         // Ruby is an interpreted language (like Python, JS), so no need to compile
//         // Using Rscript to execute code
//         // -e flag allows execution of R code passed as a string
//         codeCommand = `echo "${cleanedStdin}" | Rscript -e "${cleanedInputCode}"`;
//     }
//     else if (language === "rust"){
//         // Rust requires compilation using `cargo` or `rustc`
//         // Write the code to a temporary file
//         const tempRustFileName = "tempRustFile.rs";
//         fs.writeFileSync(tempRustFileName, cleanedInputCode);

//         // Compile the Rust file using rustc (Rust's compiler)
//         const { stderr } = await execAsync(`rustc ${tempRustFileName}`);
//         warnings = stderr; // Capture any warnings from the compilation

//         // Run the compiled Rust program (default executable is the name of the source file without extension)
//         codeCommand = `echo "${cleanedStdin}" | ./tempRustFile`;  // The compiled executable will be `tempRustFile` by default
//     }
//     // Note: At least 1 of these else branches should be reached because the language validity check...
//     //... is already done in method executingCode under file: executeCode.js
//     return { codeCommand, warnings }
// }