/*
    This is the frontend code, corresponding to the backend code for api/executeCode.js

    Milestone #1:

    NOTE: For the code execution text box UI, planning to use: Ace Editor 

    Need to run the following installation commands:
        - npm install react-ace
        - npm install ace-builds
*/
// Defining a list of imports
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from "react";
import Navbar from '../../components/Shared/Navbar';
import Link from 'next/link';
import ForkButton from '@/components/Editor/ForkButton';
import SaveButton from '@/components/Editor/SaveButton';
import AceEditor from 'react-ace'; // Loading the AceEditor import
// Loading the syntax highlighting for all the different languages
import "ace-builds/src-noconflict/mode-python";  // For Python
import "ace-builds/src-noconflict/mode-javascript";  // For JavaScript
import "ace-builds/src-noconflict/mode-java";  // For Java
import "ace-builds/src-noconflict/mode-c_cpp";  // For C and C++
import "ace-builds/src-noconflict/mode-rust";  // For Rust
import "ace-builds/src-noconflict/mode-r";  // For R
import "ace-builds/src-noconflict/mode-ruby";  // For Ruby
import "ace-builds/src-noconflict/mode-csharp";  // For C#
import "ace-builds/src-noconflict/mode-golang"; // For Go
// Loading the styling for the text boxes
// NOTE: The old editor themes (light and dark mode) were: solarized_light and solarized_dark respectively
import "ace-builds/src-noconflict/theme-monokai"; // Loading the Solarized Light theme into the editor
import "ace-builds/src-noconflict/theme-chrome";
import EditButton from '@/components/Editor/EditButton';
import DeleteButton from '@/components/Editor/DeleteButton';


interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
}


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

const useLanguageState = () => {
  // python will be the default
  const [codeLanguage, setCodeLanguage] = useState("python");

  function changeCodeLanguage(newCodeLanguage: string) {
    console.log("new code language: ", newCodeLanguage);
    setCodeLanguage(newCodeLanguage);
  }

  return [codeLanguage, changeCodeLanguage] as const;
}

const LanguageSelector =  ({ onChange, codeLanguage }: { onChange: (newLanguage: string) => void, codeLanguage: string }) => 
(
  <select className="border rounded p-2" onChange={(e) => onChange(e.target.value)} value={codeLanguage}>
    <option value="python">Python</option>
    <option value="javascript">JavaScript</option>
    <option value="java">Java</option>
    <option value="c">C</option>
    <option value="c++">C++</option>
    <option value="rust">Rust</option>
    <option value="r">R</option>
    <option value="ruby">Ruby</option>
    <option value="csharp">C#</option>
    <option value="go">Go</option>
  </select>
);

const useTemplateIdState = () => {
  // blank default
  const [templateId, setTemplateId] = useState(-1);

  function changeTemplateId(newTemplateId: number) {
    setTemplateId(newTemplateId);
  }

  return [templateId, changeTemplateId] as const;
}

const useTitleState = () => {
  // blank default
  const [codeTitle, setCodeTitle] = useState("");

  function changeCodeTitle(newCodeTitle: string) {
    setCodeTitle(newCodeTitle);
  }

  return [codeTitle, changeCodeTitle] as const;
}

const useExplanationState = () => {
  // blank default
  const [codeExplanation, setCodeExplanation] = useState("");

  function changeCodeExplanation(newCodeExplanation: string) {
    setCodeExplanation(newCodeExplanation);
  }

  return [codeExplanation, changeCodeExplanation] as const;
}

const useTagsState = () => {
  // blank default
  const [codeTags, setCodeTags] = useState("");

  function changeCodeTags(newCodeTags: string) {
    setCodeTags(newCodeTags);
  }

  return [codeTags, changeCodeTags] as const;
}

const useAuthorState = () => {
  // blank default
  const [codeAuthor, setCodeAuthor] = useState("");

  function changeCodeAuthor(newCodeAuthor: string) {
    setCodeAuthor(newCodeAuthor);
  }

  return [codeAuthor, changeCodeAuthor] as const;
}

const useCurrentUserState = () => {
  // blank default
  const [currentUser, setCurrentUser] = useState("");

  function changeCurrentUser(newCurrentUser: string) {
    setCurrentUser(newCurrentUser);
  }

  return [currentUser, changeCurrentUser] as const;
}

const TitleInput = ({ onChange, title }: { onChange: (newTitle: string) => void, title: string }) => (
  <input
    type="text"
    placeholder="Title"
    className="border rounded-lg p-4 w-full text-sm"
    onChange={(e) => onChange(e.target.value)}
    value={title}
  />
);

const ExplanationInput = ({ onChange, explanation }: { onChange: (newExplanation: string) => void, explanation: string }) => (
  <input
    type="text"
    placeholder="Explanation"
    className="border rounded-lg p-4 w-full text-sm"
    onChange={(e) => onChange(e.target.value)}
    value={explanation}
  />
);

const TagsInput = ({ onChange, tags }: { onChange: (newTags: string) => void, tags: string }) => (
  <input
    type="text"
    placeholder="Tags (comma-separated)"
    className="border rounded-lg p-4 w-full text-sm"
    onChange={(e) => onChange(e.target.value)}
    value={tags}
  />
);

//CodeEditor instance: A glorified text box where raw code can be inputted (can either be typed out by user or imported via code template)
// Define the types for the props of the CodeEditor component
// Arguments for the CodeEditor
// #1: onChange: Is a function that takes a newCode argument. This denotes the handler that CHANGES the code content of the template
// #2: value: Denotes the CURRENT code content template
// #3: codeLanguage: Denotes the language of the current code content
// CodeEditor component with correctly typed props
const CodeEditor = ({ onChange, codeInput, codeLanguage }: { onChange: (newCode: string) => void, codeInput: string, codeLanguage: string }) => (
  <AceEditor
    mode={codeLanguage}  // Set the mode dynamically based on the codeLanguage prop
    theme="chrome"
    name="code-editor"
    editorProps={{ $blockScrolling: true }}
    width="100%"
    height="400px"
    onChange={onChange}
    value={codeInput}
  />
);


// StdinEditor instance: A glorified text box where user can input text (to represent the content of stdin)
const StdinEditor: React.FC<{onChange: (newStdin: string) => void;}> = ({ onChange}) => (
  <AceEditor
    mode="text" // Since stdin is plain text, we use the 'text' mode
    theme="chrome" // Same theme as CodeEditor
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
      theme="chrome"
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
        "Running Code ... Press again to cancel" // Display Loading when isLoading is true
      ) : (
        "Run Code" // Display Run Code when isLoading is false
      )}
    </button>
  );
};

const fetchUser = async () => {
  try {
    const response = await fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile.');

    const data: UserProfile = await response.json();
    if (data) {
      console.log("email: ", data.email);
      return data.email;
    }
    
  } catch (err) {
    console.error('Failed to load profile.');
  } 
}

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
    console.log("code language OMG: ", codeLanguage);
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
  const router = useRouter();
  const { id = -1 } = router.query;

  let tempId = -1;
  let title = "";
  let explanation = "";
  let code = "";
  let language = "";
  let tags = "";
  let author = "";

  // Code Template Relation stuff
  const [templateId, changeTemplateId] = useTemplateIdState();
  const [codeTitle, changeCodeTitle] = useTitleState();
  const [codeExplanation, changeCodeExplanation] = useExplanationState();
  const [codeTags, changeCodeTags] = useTagsState();
  const [codeAuthor, changeCodeAuthor] = useAuthorState();
  const [currentUser, changeCurrentUser] = useCurrentUserState();

  console.log("id: ", id);

  useEffect(() => {
    const checkStoredData = async () => {
      const storedData = localStorage.getItem('editorData');
      // From the editor page or run button
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        console.log("template id: ", parsedData.templateId);
        
        changeTemplateId(parseInt(parsedData.templateId));
        title = parsedData.title;
        explanation = parsedData.explanation;
        code = parsedData.code;
        language = parsedData.language;
        tags = parsedData.tags;
        author = parsedData.author;

        console.log("tags: ", tags);

        changeCodeTitle(title);
        changeCodeExplanation(explanation);
        handleCodeContentChange(code);
        changeCodeLanguage(language);
        changeCodeTags(tags);
        if (author && author !== "") {
          changeCodeAuthor(author);
        }
        // setEditorData(JSON.parse(storedData));
        localStorage.removeItem('editorData');

        const userEmail = await fetchUser();
        if (userEmail) {
          changeCurrentUser(userEmail);
        }
      }
      // Directly from BlogPost case
      else if (tempId === -1 && id !== -1) {
        changeTemplateId(parseInt(id as string));
        try {
          const fetchTemplate = async () => {
            const response = await fetch(`/api/codeTemplate/getTemplate?id=${id}`);
            if (!response.ok) throw new Error('Failed to fetch template');
            const data = await response.json();
            title = data.title;
            explanation = data.explanation;
            code = data.code;
            language = data.language;
            // console.log(data.tags)
            if (data.tags) {
              tags = data.tags.map((tag: { name: string }) => tag.name).join(',');
            }
            console.log("OMG THE AUTHOR: ", data.user);
            author = data.user.email;

            changeCodeTitle(title);
            changeCodeExplanation(explanation);
            handleCodeContentChange(code);
            changeCodeLanguage(language);
            changeCodeTags(tags);
            if (author && author !== "") {
              changeCodeAuthor(author);
            }

            const userEmail = await fetchUser();
            if (userEmail) {
              changeCurrentUser(userEmail);
            }

            console.log(author === currentUser);
          };
          fetchTemplate();
        } catch (error) {
          console.error('Error fetching template:', error);
        }
      }
    }
    checkStoredData();
  }, [id]);

  const [codeLanguage, changeCodeLanguage] = useLanguageState();

  // Need to adjust the code language passed into the AceEditor (not exactly a 1 to 1 match with the languages listed in executeCode.js)
  let codeLanguageForStyling = codeLanguage;
  if (codeLanguageForStyling === "c" || codeLanguageForStyling === "c++"){
    codeLanguageForStyling = "c_cpp"
  }
  else if (codeLanguageForStyling === "go"){
    codeLanguageForStyling = "golang"
  }

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
        {/* Warning messages for Memory and Code Execution Time Limits */}
        <div className="bg-blue-600 p-4 rounded mb-6 text-white">
          <p className="text-lg font-medium">Memory Limit: 512 MB</p>
          <p className="text-lg font-medium">Code Execution Time Limit: 20 seconds</p>
        </div>
          {/* Main content layout */}
          <div className="flex justify-between items-center w-full">
            <TitleInput onChange={changeCodeTitle} title={codeTitle} />
            <ExplanationInput onChange={changeCodeExplanation} explanation={codeExplanation} />
            <TagsInput onChange={changeCodeTags} tags={codeTags} />
          </div>

          {/* Used GPT for this specific div to align it properly*/}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <label className="text-lg font-small">Language:</label>
              <LanguageSelector onChange={changeCodeLanguage} codeLanguage={codeLanguage} />
            </div>
            {templateId !== -1 && (
              <div className="ml-auto">
                <ForkButton
                  templateId={templateId as number}
                  title={codeTitle as string}
                  explanation={codeExplanation as string}
                  code={codeContent as string}
                  language={codeLanguage as string}
                  tags={codeTags as string}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center w-full">
              {((currentUser !== codeAuthor && templateId === -1) || templateId === -1) &&
                <SaveButton
                title={codeTitle as string}
                explanation={codeExplanation as string}
                code={codeContent as string}
                language={codeLanguage as string}
                tags={codeTags as string}
              />}
              {(currentUser === codeAuthor && templateId !== -1) &&
               <EditButton
                title={codeTitle as string}
                explanation={codeExplanation as string}
                code={codeContent as string}
                language={codeLanguage as string}
                tags={codeTags as string}
                templateId={templateId as number}
              />}
          </div>
          <div className="flex justify-between items-center w-full">
            {(currentUser === codeAuthor && templateId !== -1) &&
              <DeleteButton
              templateId={templateId as number}
            />}
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Left-side: Code input and Stdin */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Code Input Box</h3>
                <CodeEditor
                  onChange={handleCodeContentChange}
                  codeInput={codeContent}
                  codeLanguage = {codeLanguageForStyling}
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
                  codeLanguage,
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
