/*
    This is the frontend code, corresponding to the backend code for api/executeCode.js

    Milestone #1:

    NOTE: For the code execution text box UI, planning to use: Ace Editor 

    Need to run the following installation commands:
        - npm install react-ace
        - npm install ace-builds
*/
// Defining a list of imports
import React, { useRef, useState } from "react";
import Navbar from '../components/Shared/Navbar';
import AceEditor from 'react-ace'; // Loading the AceEditor import
import "ace-builds/src-noconflict/mode-python"; // Loading the Python language mode into the editor
import "ace-builds/src-noconflict/theme-solarized_light"; // Loading the Solarized Light theme into the editor

// Custom hook to manage the code content state
// Arguments for the useCodeState
// #1: Takes an initial argument for the code template content. By default, is an empty string ("")
const useCodeState = (initialCodeContent: string = "") => {
  const [codeContent, setCodeContent] = useState(initialCodeContent);
  
  function handleCodeContentChange(newCodeContent: string) {
    setCodeContent(newCodeContent);
  }

  return [codeContent, handleCodeContentChange] as const; 
};

// Custom hook to manage the stdinInput state
// Unlike the one for useCodeState, no argumeents necessary here since the default value is just an empty string ("")
const useStdinState = () => {
  const [stdinContent, setStdinContent] = useState("");

  function handleStdinContentChange(newStdinContent: string) {
    setStdinContent(newStdinContent);
  }

  return [stdinContent, handleStdinContentChange] as const;
};

// Custom hook to manage the stdOut content
// No argument here since the default value is just an empty string ("")
// NOTE: This is a READ ONLY VALUE
const useStdOutState = () => {
  const [stdoutContent, setStdoutContent] = useState("");

  function handleStoutContentChange(newStdoutContent: string) {
    setStdoutContent(newStdoutContent);
  }

  return [stdoutContent, handleStoutContentChange] as const;
};

// Custom hook to manage the stderr content
// No argument here since the default value is just an empty string ("")
// NOTE: This is a READ ONLY VALUE
const useStderrState = () => {
  const [stderrContent, setStderrContent] = useState("");

  function handleStderrContentChange(newStderrContent: string) {
    setStderrContent(newStderrContent);
  }
  return [stderrContent, handleStderrContentChange] as const;
};

// Custom hook to manage the loading state of the "Run Code" button
const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);

  function setLoadingState(isLoading: boolean) {
    setIsLoading(isLoading);
  }

  return [isLoading, setLoadingState] as const;
};

//CodeEditor instance: A glorified text box where raw code can be inputted (can either be typed out by user or imported via code template)
// Define the types for the props of the CodeEditor component
// Arguments for the CodeEditor
// #1: onChange: Is a function that takes a newCode argument. This denotes the handler that CHANGES the code content of the template
// #2: value: Denotes the CURRENT code content template
// CodeEditor component with correctly typed props
const CodeEditor: React.FC<{onChange: (newCode: string) => void; codeInput: string;}> = ({ onChange, codeInput }) => (
  <AceEditor
    mode="python"
    theme="solarized_light"
    name="code-editor"
    editorProps={{ $blockScrolling: true }}
    width="100%"
    height="400px"
    onChange={onChange} // Pass the onChange handler function
    value={codeInput}  // Bind the value to the codeInput prop
  />
);


// StdinEditor instance: A glorified text box where user can input text (to represent the content of stdin)
const StdinEditor: React.FC<{onChange: (newStdin: string) => void;}> = ({ onChange}) => (
  <AceEditor
    mode="text" // Since stdin is plain text, we use the 'text' mode
    theme="solarized_light" // Same theme as CodeEditor
    name="stdin-editor"
    editorProps={{ $blockScrolling: true }}
    width="100%"
    height="300px" // A smaller height for stdin input
    onChange={onChange} // Pass the onChange handler function
  />
);

//CodeOutput instance: A glorified text box where user can display stdOut and stdErrpr content
const OutputEditor: React.FC<{ stdoutContent: string; stderrContent: string }> = ({ stdoutContent, stderrContent }) => {
  // Combine standard output and error with labels
  const combinedOutput = `Standard Output:\n${stdoutContent}\n\nStandard Error:\n${stderrContent}`;
  return (
    <AceEditor
      mode="text"
      theme="solarized_light"
      name="output-editor"
      editorProps={{ $blockScrolling: true }}
      width="100%"
      height="760px"
      value={combinedOutput}
      readOnly={true}
    />
  );
};

const RunCodeButton = ({
  onClick,
  isLoading,
}: {
  onClick: (controllerRef: React.RefObject<AbortController>, isLoading: boolean) => void;
  isLoading: boolean;
}) => {
  const controllerRef = useRef<AbortController | null>(null); // Store the controller reference

  return (
    <button 
      onClick={() => onClick(controllerRef, isLoading)} 
      // Don't disable so the user can cancel the operation
    >
      {isLoading ? (
        "Loading..." // Display Loading when isLoading is true
      ) : (
        "Run Code" // Display Run Code when isLoading is false
      )}
    </button>
  );
};

// Handler to send the code input to the backend API endpoint.
const handleRunCodeClick = async (
  codeContent: string,
  codeLanguage: string,
  codeStdin: string,
  setStdoutContent: (value: string) => void,
  setStderrContent: (value: string) => void,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
  controllerRef: React.MutableRefObject<AbortController | null> // Reference to the AbortController
) => {
  if (isLoading) {
    // If the button is in the loading state, trigger the cancellation
    controllerRef.current?.abort(); // Cancel the fetch request or operation
    setIsLoading(false); // Reset isLoading to false after cancelling
    return;
  }

  // Proceed with running the code (if not loading)
  const abortController = new AbortController();
  controllerRef.current = abortController; // Set the new controller reference
  // Reset state variables for fresh execution
  setStdoutContent(""); 
  setStderrContent("");
  setIsLoading(true); // Set isLoading to true when starting the operation
  
  const endpointJsonStr = JSON.stringify({
    inputCode: codeContent,
    language: codeLanguage,
    stdin: codeStdin,
  });

  try {
    const response = await fetch("/api/executeCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: endpointJsonStr,
      signal: abortController.signal, // Attach the signal for aborting
    });

    const data = await response.json();

    setStdoutContent(data.output || "No output returned");
    setStderrContent(data.error || "No errors");

  } catch (error) {
    console.log("Error executing code. Please try again.");
    }finally {
    setIsLoading(false); // Reset the loading state
    controllerRef.current = null; // Clear the controller reference
  }
};


// Main component to bring everything together
const ExecuteCodePage: React.FC = () => {

  // TODO: Eventually, these would be populated by the template attributes
  const codeLanguageFromTemplate = "python"; // FIXME: Placeholder. corresponds to the <code> attribute of the template
  
  // Defining the code content state variable + function to manage state
  const codeContentFromTemplate = "print('Hello World')";
  const [codeContent, handleCodeContentChange] = useCodeState(codeContentFromTemplate);

  // Defining the stdin content state variable + function to manage state
  const [stdinContent, handleStdinContentChange] = useStdinState();

  // Defining the stdout and stderror content state variables + functions to manage state
  const [stdoutContent, setStdoutContent] = useStdOutState();
  const [stderrContent, setStderrContent] = useStderrState();

  // Defining the "Run button" loading state variable + function to manage state
  const [isLoading, setIsLoading] = useLoadingState();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Code Execution Page</h1>
  
        <div className="bg-white p-6 rounded shadow space-y-6">
          {/* Main content layout */}
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Left-side: Code input and Stdin */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Code Input Box</h3>
                <CodeEditor
                  onChange={handleCodeContentChange}
                  codeInput={codeContent}
                />
              </div>
  
              <div>
                <h3 className="text-lg font-medium mb-2">Standard Input Box</h3>
                <StdinEditor onChange={handleStdinContentChange} />
              </div>
            </div>
  
            {/* Right-side: Output */}
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Output</h3>
              <OutputEditor
                stdoutContent={stdoutContent}
                stderrContent={stderrContent}
              />
            </div>
          </div>
  
          <div className="text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <RunCodeButton
              onClick={(controllerRef, isLoading) =>
                handleRunCodeClick(
                  codeContent,
                  codeLanguageFromTemplate,
                  stdinContent,
                  setStdoutContent,
                  setStderrContent,
                  isLoading,
                  setIsLoading,
                  controllerRef
                )
              }
              isLoading={isLoading}
            />
          </div>
  
          {/* Temporary debugging output */}
          <div>
            <h3 className="text-lg font-medium">Temporary Debug Output</h3>
            <p className="text-sm text-gray-700">{codeContent}</p>
            <p className="text-sm text-gray-700">{stdinContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default ExecuteCodePage;


// FIXME: This is the old version of the code
// /*
//     This is the frontend code, corresponding to the backend code for api/executeCode.js

//     Milestone #1:

//     NOTE: For the code execution text box UI, planning to use: Ace Editor 

//     Need to run the following installation commands:
//         - npm install react-ace
//         - npm install ace-builds
// */
// // Defining a list of imports
// import React, { useState } from "react";
// import Navbar from '../components/Shared/Navbar';
// import AceEditor from 'react-ace'; // Loading the AceEditor import
// import "ace-builds/src-noconflict/mode-python"; // Loading the Python language mode into the editor
// import "ace-builds/src-noconflict/theme-solarized_light"; // Loading the Solarized Light theme into the editor

// // Custom hook to manage the code content state
// // Arguments for the useCodeState
// // #1: Takes an initial argument for the code template content. By default, is an empty string ("")
// const useCodeState = (initialCodeContent: string = "") => {
//   const [codeContent, setCodeContent] = useState(initialCodeContent);
  
//   function handleCodeContentChange(newCodeContent: string) {
//     setCodeContent(newCodeContent);
//   }

//   return [codeContent, handleCodeContentChange] as const; 
// };

// // Custom hook to manage the stdinInput state
// // Unlike the one for useCodeState, no argumeents necessary here since the default value is just an empty string ("")
// const useStdinState = () => {
//   const [stdinContent, setStdinContent] = useState("");

//   function handleStdinContentChange(newStdinContent: string) {
//     setStdinContent(newStdinContent);
//   }

//   return [stdinContent, handleStdinContentChange] as const;
// };

// // Custom hook to manage the stdOut content
// // No argument here since the default value is just an empty string ("")
// // NOTE: This is a READ ONLY VALUE
// const useStdOutState = () => {
//   const [stdoutContent, setStdoutContent] = useState("");

//   function handleStoutContentChange(newStdoutContent: string) {
//     setStdoutContent(newStdoutContent);
//   }

//   return [stdoutContent, handleStoutContentChange] as const;
// };

// // Custom hook to manage the stderr content
// // No argument here since the default value is just an empty string ("")
// // NOTE: This is a READ ONLY VALUE
// const useStderrState = () => {
//   const [stderrContent, setStderrContent] = useState("");

//   function handleStderrContentChange(newStderrContent: string) {
//     setStderrContent(newStderrContent);
//   }
//   return [stderrContent, handleStderrContentChange] as const;
// };

// // Custom hook to manage the loading state of the "Run Code" button
// const useLoadingState = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   function setLoadingState(isLoading: boolean) {
//     setIsLoading(isLoading);
//   }

//   return [isLoading, setLoadingState] as const;
// };

// //CodeEditor instance: A glorified text box where raw code can be inputted (can either be typed out by user or imported via code template)
// // Define the types for the props of the CodeEditor component
// // Arguments for the CodeEditor
// // #1: onChange: Is a function that takes a newCode argument. This denotes the handler that CHANGES the code content of the template
// // #2: value: Denotes the CURRENT code content template
// // CodeEditor component with correctly typed props
// const CodeEditor: React.FC<{onChange: (newCode: string) => void; codeInput: string;}> = ({ onChange, codeInput }) => (
//   <AceEditor
//     mode="python"
//     theme="solarized_light"
//     name="code-editor"
//     editorProps={{ $blockScrolling: true }}
//     width="100%"
//     height="400px"
//     onChange={onChange} // Pass the onChange handler function
//     value={codeInput}  // Bind the value to the codeInput prop
//   />
// );


// // StdinEditor instance: A glorified text box where user can input text (to represent the content of stdin)
// const StdinEditor: React.FC<{onChange: (newStdin: string) => void;}> = ({ onChange}) => (
//   <AceEditor
//     mode="text" // Since stdin is plain text, we use the 'text' mode
//     theme="solarized_light" // Same theme as CodeEditor
//     name="stdin-editor"
//     editorProps={{ $blockScrolling: true }}
//     width="100%"
//     height="300px" // A smaller height for stdin input
//     onChange={onChange} // Pass the onChange handler function
//   />
// );

// //CodeOutput instance: A glorified text box where user can display stdOut and stdErrpr content
// const OutputEditor: React.FC<{ stdoutContent: string; stderrContent: string }> = ({ stdoutContent, stderrContent }) => {
//   // Combine standard output and error with labels
//   const combinedOutput = `Standard Output:\n${stdoutContent}\n\nStandard Error:\n${stderrContent}`;
//   return (
//     <AceEditor
//       mode="text"
//       theme="solarized_light"
//       name="output-editor"
//       editorProps={{ $blockScrolling: true }}
//       width="100%"
//       height="760px"
//       value={combinedOutput}
//       readOnly={true}
//     />
//   );
// };


// // RunCodeButton component to handle the alert functionality
// // Note: Since codeContent is a prop variable, need to wrap it in a React.FC definition
// const RunCodeButton = ({ onClick, isLoading}: { onClick: () => void, isLoading: boolean})  => {
//   return (
//     <button onClick={onClick} disabled={isLoading}>
//       {isLoading ? (
//         "Running..."
//       ) : (
//         "Run Code"
//       )}
//     </button>
//   );
// };

// // Handler to send the code input to the backend API endpoint. reference file: api/executeCode.js
// // Argument codeContent: The code input
// // Argument codeLanguage: The language of the code being ran
// // Argument codeStdin: The standard input of the code being ra
// const handleRunCodeClick = async (codeContent: string, codeLanguage: string, codeStdin: string,
//   setStdoutContent: any, //FIXME: Used any to suppress the warnings
//   setStderrContent: any,  //FIXME: Used any to suppress the warnings
//   setIsLoading: any
// ) => {
//   const endpointJsonStr = JSON.stringify({
//     inputCode: codeContent, 
//     language: codeLanguage,
//     stdin: codeStdin
//   })
//   // Define all values of state variables initially
//   setStdoutContent(""); // Resetting standard output content each time button is pressed
//   setStderrContent(""); // Resetting standard error content each time button is pressed
//   setIsLoading(true); // Set the button to loading when the code execution request is initially processed
//   try {
//     // Construct the method and header for the intended response
//     const response = await fetch("/api/executeCode", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: endpointJsonStr,
//     });
//     // Await for the JSON output
//     const data = await response.json();

//     // Setting the stdoutContent and stderrContent variables using the setter functions
//     setStdoutContent(data.output || "No output returned");
//     setStderrContent(data.error || "No errors");

//     // Finally, since the code execution is done, set the "Run Code" button back to false state
//     setIsLoading(false);

//     // FIXME: Temporary alert to test output
//     // alert(
//     //   `Output (Standard output): ${data.output || "No output returned"}\n` +
//     //   `Warnings and/or Errors (Standard error): ${data.error || "No errors"}`
//     // );
//   } catch (error) {
//     console.log("Error executing code. Please try again.");
//     setIsLoading(false);
//   }
// };

// // Main component to bring everything together
// const ExecuteCodePage: React.FC = () => {

//   // TODO: Eventually, these would be populated by the template attributes
//   const codeLanguageFromTemplate = "python"; // FIXME: Placeholder. corresponds to the <code> attribute of the template
  
//   // Defining the code content state variable + function to manage state
//   const codeContentFromTemplate = "print('Hello World')";
//   const [codeContent, handleCodeContentChange] = useCodeState(codeContentFromTemplate);

//   // Defining the stdin content state variable + function to manage state
//   const [stdinContent, handleStdinContentChange] = useStdinState();

//   // Defining the stdout and stderror content state variables + functions to manage state
//   const [stdoutContent, setStdoutContent] = useStdOutState();
//   const [stderrContent, setStderrContent] = useStderrState();

//   // Defining the "Run button" loading state variable + function to manage state
//   const [isLoading, setIsLoading] = useLoadingState();

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-6">Code Execution Page</h1>
  
//         <div className="bg-white p-6 rounded shadow space-y-6">
//           {/* Main content layout */}
//           <div className="flex flex-col lg:flex-row lg:space-x-6">
//             {/* Left-side: Code input and Stdin */}
//             <div className="flex-1 space-y-6">
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Code Input Box</h3>
//                 <CodeEditor
//                   onChange={handleCodeContentChange}
//                   codeInput={codeContent}
//                 />
//               </div>
  
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Standard Input Box</h3>
//                 <StdinEditor onChange={handleStdinContentChange} />
//               </div>
//             </div>
  
//             {/* Right-side: Output */}
//             <div className="flex-1">
//               <h3 className="text-lg font-medium mb-2">Output</h3>
//               <OutputEditor
//                 stdoutContent={stdoutContent}
//                 stderrContent={stderrContent}
//               />
//             </div>
//           </div>
  
//           <div className="text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             <RunCodeButton
//               onClick={() =>
//                 handleRunCodeClick(
//                   codeContent,
//                   codeLanguageFromTemplate,
//                   stdinContent,
//                   setStdoutContent,
//                   setStderrContent,
//                   setIsLoading
//                 )
//               }
//               isLoading={isLoading}
//             />
//           </div>
  
//           {/* Temporary debugging output */}
//           <div>
//             <h3 className="text-lg font-medium">Temporary Debug Output</h3>
//             <p className="text-sm text-gray-700">{codeContent}</p>
//             <p className="text-sm text-gray-700">{stdinContent}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }  

// // /*
// // Old return method: 
// // return (
// //   <div>
// //     <h1>Code execution page</h1>
// //     <br />
// //     <br />
    
// //     {/* Code editor component, passing the change handler */}
// //     <h3>Code input box: </h3>
// //     <CodeEditor onChange={handleCodeContentChange} codeInput={codeContent} />
// //     <br />
    
// //     {/* Stdin editor component, passing the change handler */}
// //     <h3>Standard Input box: </h3>
// //     <StdinEditor onChange={handleStdinContentChange} />
// //     <br />
    
// //     <OutputEditor stdoutContent={stdoutContent} stderrContent={stderrContent} />
// //     <br />
// //     <br />
// //     <br />
    
// //     {/* Button to trigger displaying the code, button logic stays in ExecuteCodePage */}
// //     <RunCodeButton
// //       onClick={() =>
// //         handleRunCodeClick(
// //           codeContent,
// //           codeLanguageFromTemplate,
// //           stdinContent,
// //           setStdoutContent,
// //           setStderrContent
// //         )
// //       }
// //     />
// //     <br />
    
// //     <h3>TEMPORARY TAGS: Printing out the raw output for both code content and stdin content:</h3>
    
// //     {/* Display the code below */}
// //     <p>{codeContent}</p>
// //     <p>{stdinContent}</p>
// //     <br />
// //   </div>
// // );
// // }

// export default ExecuteCodePage;