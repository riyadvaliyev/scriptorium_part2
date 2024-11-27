import { useRouter } from "next/router";

interface EditButtonProps {
    title: string;
    explanation: string;
    code: string;
    language: string;
    tags: string;
    templateId: number;
  }
  
  const EditButton: React.FC<EditButtonProps> = ({ 
    title, 
    explanation, 
    code, 
    language, 
    tags,
    templateId
  }) => {
    const router = useRouter();
  
    const handleEdit = async (
      title: string = "",
      explanation: string = "",
      code: string = "",
      language: string = "",
      tags: string = "",
      templateId: number = -1,
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
          return tag;  // for editTemplate it just takes in an array of strings
        });
      }
  
      try {
        const editData = {
          title: title,
          explanation: explanation,
          tags: modified_tags_json,
          code: code,
          language: language,
          templateId: templateId,
        };
        // filter tags:
        // console.log("api literal:", `/api/templates/editTemplate?${params.toString()}`);
        const response = await fetch("/api/templates/editTemplate", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editData),
        });
  
        const data = await response.json();
        
        if (data.error === "Unauthorized" || data.error === "Token is not valid") {
            // redirect to login page
            // window.alert("You must be logged in to edit a template. Please log in.");
            // console.log("here first")
            router.push('/login');
        } else if (data.error) {
            console.log("Error editing template", data.error);
            window.alert("Error editing template. Please try again later."); 
        }
        else {
            // console.log("Edited template ID:", template.id);
            window.alert("Template edited successfully!");
            // localStorage.setItem('editorData', JSON.stringify({
            //     templateId: template.id,
            //     title: title,
            //     explanation: explanation,
            //     code: code,
            //     language: language,
            //     tags: tags,
            //     author: template.user.email,
            // }));
            // router.push({ pathname: `/editor/${template.id}` });

            // console.log("data:", data);
            // window.location.href = `/templates/${template.id}`
        }
      } catch (error: any) {
        // console.log("Error editing template", error);
        console.log("OMG: ", error.message);
        // console.error(error.message);
        
        // this means the user is not logged in (invalid token)
        if (error?.errorId === 1 || error?.errorId === 3 || error === "Unauthorized" || error === "Token is not valid") {  // Invalid Token or User Not Found
            // console.error(error.message);
  
            // redirect to login page
            //   window.location.href = '/login';  // redirects to the login page
            // router.push('/login');
            //   window.prompt("You must be logged in to edit a template. Please log in.");
        } else {
            // console.error("Error editing template", error);
            window.alert("Error editing template. Please try again later.");
        }
      }
    };
  
    return (
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() =>
          handleEdit(
            title as string,
            explanation as string,
            code as string,
            language as string,
            tags as string,
            templateId as number,
            router 
          )
        }
      >
        Edit ⛏
      </button>
    );
  }

export default EditButton;