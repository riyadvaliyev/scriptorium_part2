import { useRouter } from "next/router";

interface SaveButtonProps {
    title: string;
    explanation: string;
    code: string;
    language: string;
    tags: string;
  }
  
  const SaveButton: React.FC<SaveButtonProps> = ({ 
    title, 
    explanation, 
    code, 
    language, 
    tags 
  }) => {
    const router = useRouter();
  
    const handleSave = async (
      title: string = "",
      explanation: string = "",
      code: string = "",
      language: string = "",
      tags: string = "",
      router: ReturnType<typeof useRouter> // Accept the router as an argument
    ) => {
      let modified_tags_json;
  
      if (tags) {
        console.log("in tagsSearchTerm");
        let modified_tags = tags.split(',');
        // trim each tag's front and back bc there might be leading/trailing spaces by accident
        modified_tags = modified_tags.map(tag => tag.trim());
        // then remove any empty strings
        modified_tags = modified_tags.filter(tag => tag !== "");
        // append each tag to params
        console.log("tags:", modified_tags);
        // format into tags: [ {name: "tag1"}, {name: "tag2"}, ... ]
        modified_tags_json = modified_tags.map(tag => { 
          return { name: tag }; 
        });
      }
  
      try {
        const saveData = {
          title: title,
          explanation: explanation,
          tags: modified_tags_json,
          code: code,
          language: language,
        };
        // filter tags:
        // console.log("api literal:", `/api/templates/saveTemplate?${params.toString()}`);
        const response = await fetch("/api/templates/saveTemplate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(saveData),
        });
  
        const data = await response.json();
        const template = data.savedTemplate;
        
        if (data.error === "Unauthorized" || data.error === "Token is not valid") {
            // redirect to login page
            // window.alert("You must be logged in to save a template. Please log in.");
            // console.log("here first")
            router.push('/login');
        } else if (data.error) {
            console.log("Error saving template", data.error);
            window.alert("Error saving template. Please try again later."); 
        }
        else {
            // console.log("Saved template ID:", template.id);
            console.log("Saved template ID:", template);
            localStorage.setItem('editorData', JSON.stringify({
                templateId: template.id,
                title: title,
                explanation: explanation,
                code: code,
                language: language,
                tags: tags,
                author: template.user.email,
            }));

            router.push({ pathname: `/editor/${template.id}` });

            window.alert("Template saved successfully!");

            // console.log("data:", data);
            // window.location.href = `/templates/${template.id}`
        }
      } catch (error: any) {
        // console.log("Error saving template", error);
        console.log("OMG: ", error.message);
        // console.error(error.message);
        
        // this means the user is not logged in (invalid token)
        if (error?.errorId === 1 || error?.errorId === 3 || error === "Unauthorized" || error === "Token is not valid") {  // Invalid Token or User Not Found
            // console.error(error.message);
  
            // redirect to login page
            //   window.location.href = '/login';  // redirects to the login page
            // router.push('/login');
            //   window.prompt("You must be logged in to save a template. Please log in.");
        } else {
            // console.error("Error saving template", error);
            window.alert("Error saving template. Please try again later.");
        }
      }
    };
  
    return (
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() =>
          handleSave(
            title as string,
            explanation as string,
            code as string,
            language as string,
            tags as string,
            router 
          )
        }
      >
        Save 💾
      </button>
    );
  }

export default SaveButton;