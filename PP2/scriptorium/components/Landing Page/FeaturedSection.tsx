import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../Shared/ThemeProvider"; // Import ThemeContext

// Define interfaces for Blog and Template data
interface Blog {
  id: number;
  title: string;
  content: string;
}

interface Template {
  id: number;
  title: string;
  explanation: string;
}

const FeaturedSection: React.FC = () => {
  const [blogs, setBlogs] = useState<{ data: Blog[] }>({ data: [] });
  const [templates, setTemplates] = useState<{ data: Template[] }>({ data: [] });

  // Access the theme context
  const { isDarkMode } = useContext(ThemeContext) || {};

  // Fetch blogs and templates from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<{ data: Blog[] }>("/api/blog/get");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await axios.get<{ data: Template[] }>("/api/template/get");
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchBlogs();
    fetchTemplates();
  }, []);

  // Update the body background color based on the theme
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = "#1a202c"; // Dark background color
    } else {
      document.body.style.backgroundColor = "#ffffff"; // Light background color
    }
  }, [isDarkMode]);

  return (
    <div
    className={`p-8 ${isDarkMode ? "bg-[#1a202c] text-white" : "bg-white text-black"}`}
  >
    <h2 className="text-2xl font-bold mb-4">Featured Blogs</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {blogs.data.map((blog) => (
        <div
          key={blog.id}
          className={`p-4 border ${
            isDarkMode
              ? "border-gray-700 bg-[#1a202c]" // Apply the dark background here
              : "border-gray-300 bg-gray-100"
          } rounded shadow`}
        >
          <h3 className="text-lg font-semibold">{blog.title}</h3>
          <p>{blog.content}</p>
        </div>
      ))}
    </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Featured Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.data.map((template) => (
          <div
            key={template.id}
            className={`p-4 border ${
              isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-100"
            } rounded shadow`}
          >
            <h3 className="text-lg font-semibold">{template.title}</h3>
            <p>{template.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;




// import React, { useEffect, useState } from "react";
// import axios from "axios";

// // Define interfaces for Blog and Template data
// interface Blog {
//   id: number;
//   title: string;
//   content: string;
// }

// interface Template {
//   id: number;
//   title: string;
//   explanation: string;
// }

// const FeaturedSection: React.FC = () => {
//   const [blogs, setBlogs] = useState<{ data: Blog[] }>({ data: [] });
//   const [templates, setTemplates] = useState<{ data: Template[] }>({ data: [] });

//   // Fetch blogs and templates from API
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await axios.get<{ data: Blog[] }>("/api/blog/get");
//         setBlogs(response.data);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//       }
//     };

//     const fetchTemplates = async () => {
//       try {
//         const response = await axios.get<{ data: Template[] }>("/api/template/get");
//         setTemplates(response.data);
//       } catch (error) {
//         console.error("Error fetching templates:", error);
//       }
//     };

//     fetchBlogs();
//     fetchTemplates();
//   }, []);

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-4">Featured Blogs</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {blogs.data.map((blog) => (
//           <div key={blog.id} className="p-4 border border-gray-300 rounded shadow">
//             <h3 className="text-lg font-semibold">{blog.title}</h3>
//             <p className="text-gray-600">{blog.content}</p>
//           </div>
//         ))}
//       </div>

//       <h2 className="text-2xl font-bold mt-8 mb-4">Featured Templates</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {templates.data.map((template) => (
//           <div key={template.id} className="p-4 border border-gray-300 rounded shadow">
//             <h3 className="text-lg font-semibold">{template.title}</h3>
//             <p className="text-gray-600">{template.explanation}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeaturedSection;
