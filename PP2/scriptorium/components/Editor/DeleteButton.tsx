import { useRouter } from "next/router";

interface DeleteButtonProps {
    templateId: number;
  }
  
  const DeleteButton: React.FC<DeleteButtonProps> = ({ 
    templateId
  }) => {
    const router = useRouter();
  
    const handleDelete = async (
      templateId: number = -1,
      router: ReturnType<typeof useRouter> // Accept the router as an argument
    ) => {
  
      try {
        const deleteData = {
          templateId: templateId,
        };
        // filter tags:
        // console.log("api literal:", `/api/templates/editTemplate?${params.toString()}`);
        const response = await fetch("/api/templates/editTemplate", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(deleteData),
        });
  
        const data = await response.json();
        
        if (data.error === "Unauthorized" || data.error === "Token is not valid") {
            router.push('/login');
        } else if (data.error) {
            console.log("Error deleting template", data.error);
            window.alert("Error deleting template. Please try again later."); 
        }
        else {
            // console.log("Deleted template ID:", template.id);
            router.push({ pathname: `/templates` });  // redirect to the templates page after deleting
            localStorage.removeItem('editorData');
            window.alert("Template deleted successfully!");
        }
      } catch (error: any) {
        // console.log("Error deleting template", error);
        console.log("OMG: ", error.message);
        // console.error(error.message);
        
        // this means the user is not logged in (invalid token)
        if (error?.errorId === 1 || error?.errorId === 3 || error === "Unauthorized" || error === "Token is not valid") {  // Invalid Token or User Not Found
            // console.error(error.message);
  
            // redirect to login page
            //   window.location.href = '/login';  // redirects to the login page
            // router.push('/login');
            //   window.prompt("You must be logged in to delete a template. Please log in.");
        } else {
            // console.error("Error deleting template", error);
            window.alert("Error deleting template. Please try again later.");
        }
      }
    };
  
    return (
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() =>
          handleDelete(
            templateId as number,
            router 
          )
        }
      >
        Delete 🗑️
      </button>
    );
  }

export default DeleteButton;