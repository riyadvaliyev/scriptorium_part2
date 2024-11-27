import { useRouter } from "next/router";

interface ForkButtonProps {
    templateId: number;
    title: string;
    explanation: string;
    code: string;
    language: string;
    tags: string;
  }
  
  const ForkButton: React.FC<ForkButtonProps> = ({ 
    templateId, 
    title, 
    explanation, 
    code, 
    language, 
    tags 
  }) => {
    const router = useRouter();
  
    const handleFork = async (
      templateId: number = -1,
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
        const forkData = {
          title: title,
          explanation: explanation,
          language: language,
          tags: modified_tags_json,
          code: code,
          templateId: templateId,
        };
        // filter tags:
        // console.log("api literal:", `/api/templates/forkTemplate?${params.toString()}`);
        const response = await fetch("/api/templates/forkTemplate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(forkData),
        });
  
        const data = await response.json();
        const template = data.template;

        if (data.error === "Unauthorized" || data.error === "Token is not valid") {
            // redirect to login page
            // window.alert("You must be logged in to fork a template. Please log in.");
            router.push('/login');
        } else if (data.error) {
            // console.error("Error forking template", data.error);
            throw new Error(data.error);
        } else {
            // console.log("Forked template ID:", template.id);
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

            window.alert("Template forked successfully!");
            // console.log("data:", data);
            // window.location.href = `/templates/${template.id}`
        }
      } catch (error: any) {
        console.log("Error forking template", error);
        console.error(error.message);
        
        // this means the user is not logged in (invalid token)
        if (error?.errorId === 1 || error?.errorId === 3 || error === "Unauthorized" || error === "Token is not valid") {  // Invalid Token or User Not Found
            // console.error(error.message);
  
            // redirect to login page
            //   window.location.href = '/login';  // redirects to the login page
            router.push('/login');
            //   window.prompt("You must be logged in to fork a template. Please log in.");
        } else if (error.message === "Tags are required.") {
            // console.error("Error forking template", error);
            window.alert("Must input at least one tag.");
        }
        else {
            // console.error("Error forking template", error);
            window.alert(`Error forking template. ${error.message}`);
        }
      }
    };
  
    return (
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() =>
          handleFork(
            templateId as number,
            title as string,
            explanation as string,
            code as string,
            language as string,
            tags as string,
            router 
          )
        }
      >
        Fork ▶
      </button>
    );
  }

export default ForkButton;