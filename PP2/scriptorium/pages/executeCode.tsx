/*
    This is the frontend code, corresponding to the backend code for api/executeCode.js

    Milestone #1:

    NOTE: For the code execution text box UI, planning to use: Ace Editor 

    Need to run the following installation commands:
        - npm install react-ace
        - npm install ace-builds
*/
// Defining a list of imports
import React, { useState } from "react";
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
    width="50%"
    height="400px"
    onChange={onChange} // Pass the onChange handler function
    value={codeInput}  // Bind the value to the codeInput prop
  />
);

// RunCodeButton component to handle the alert functionality
// Note: Since codeContent is a prop variable, need to wrap it in a React.FC definition
const RunCodeButton = ({ onClick }: { onClick: () => void })  => {
  return <button onClick={onClick}>Run Code</button>;
};

// Handler to send the code input to the backend API endpoint. reference file: api/executeCode.js
// Argument codeContent: The code input
// Argument codeLanguage: The language of the code being ran
// Argument codeStdin: The standard input of the code being ra
const handleRunCodeClick = async (codeContent: string, codeLanguage: string, codeStdin: string) => {
  const endpointJsonStr = JSON.stringify({
    inputCode: codeContent, 
    language: codeLanguage,
    stdin: codeStdin
  })
  try {
    const response = await fetch("/api/executeCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: endpointJsonStr,
    });

    const data = await response.json();
    alert(data.output || "No output returned"); // For now, display the output in an alert
  } catch (error) {
    alert("Error executing code. Please try again.");
  }
};

// Main component to bring everything together
const ExecuteCodePage: React.FC = () => {

  // TODO: Eventually, these would be populated by the template attributes
  const codeLanguageFromTemplate = "javascript"; // FIXME: Placeholder. corresponds to the <code> attribute of the template
  // Defining the code Contnet state variable + function to manage state
  const codeContentFromTemplate = "console.warn(\"This is a warning message.\");\nconsole.log(\"Hello, World!\");";
  const [codeContent, handleCodeContentChange] = useCodeState(codeContentFromTemplate);

  return (
    <div>
      <h1>Code execution page</h1>
      <br />
      {/* Code editor component, passing the change handler */}
      <CodeEditor onChange={handleCodeContentChange} codeInput={codeContent}/>
      <br />
      {/* Button to trigger displaying the code, button logic stays in ExecuteCodePage */}
      <RunCodeButton onClick={() => handleRunCodeClick(codeContent, codeLanguageFromTemplate, "")} />
      {/* Display the code below */}
      <p>{codeContent}</p>
    </div>
  );
};

export default ExecuteCodePage;
