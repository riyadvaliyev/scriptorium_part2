import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Shared/Navbar';
import TemplatePages from '@//components/Template/TemplatePages';
import TemplateSearchBar from '@/components/Template/TemplateSearchBar';
import TemplateList from '@/components/Template/TemplateList';
import TemplateContentSearchBar from '@/components/Template/TemplateContentSearchBar';
import TemplateTagsSearchBar from '@/components/Template/TemplateTagsSearchBar';

// Define the Template type
interface Template {
    id: number;
    title: string;
    explanation: string;
    code: string;
    language: string;
    user?: {
        firstName?: string;
        lastName?: string;
    };
    tags?: { 
        id: number;
        name: string 
    }[];
    codeTemplateChildren?: { name: string }[];
}

const Template: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    //   const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [codeContentSearchTerm, setCodeContentSearchTerm] = useState('');
    const [tagsSearchTerm, setTagsSearchTerm] = useState('');
    //   const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Fetch all posts on component mount
    useEffect(() => {
        const fetchTemplates = async () => {
        try {
            const response = await fetch(`/api/templates/searchTemplate`);
            if (!response.ok) throw new Error('Failed to fetch code templates');
            const data = await response.json();
            console.log('Fetched Templates:', data.data);
            setTemplates(data.data as Template[]);
            // setFilteredPosts(data.posts as Template[]);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        };
        fetchTemplates();
    }, []);

    // useEffect(() => {

    // }, [searchTerm, templates]);

    // useEffect(() => {

    // }, [codeContentSearchTerm, templates]);

    // useEffect(() => {

    // }, [tagsSearchTerm, templates]);

  // Handle search
  useEffect(() => {
    const fetchTemplatesWithFilter = async () => {
    try {
        let params = new URLSearchParams();
        if (searchTerm) params.append('title', searchTerm);
        if (codeContentSearchTerm) params.append('content', codeContentSearchTerm);
        // filter tags:
        if (tagsSearchTerm) {
            console.log("in tagsSearchTerm");
            // check if first character is a comma, remove it
            if (tagsSearchTerm.charAt(0) === ',') {
                // can't update tagsSearchTerm directly, so update it through setTagsSearchTerm
                setTagsSearchTerm(tagsSearchTerm.slice(1));
            }
            // check if last character is a comma, remove it
            if (tagsSearchTerm.charAt(tagsSearchTerm.length - 1) === ',') {
                setTagsSearchTerm(tagsSearchTerm.slice(0, tagsSearchTerm.length - 1));
            }
            let tags = tagsSearchTerm.split(',');
            // trim each tag's front and back bc there might be leading/trailing spaces by accident
            tags = tags.map(tag => tag.trim());
            // append each tag to params
            tags.forEach(tag => { params.append('tags', tag); });
            console.log("tags:", tags);
            console.log("params:", params);
        }
        params.append('page', '1'); // Add default pagination
        params.append('pageSize', '12'); // Add default pagination

        console.log("api literal:", `/api/templates/searchTemplate?${params.toString()}`);
        const response = await fetch(`/api/templates/searchTemplate?${params.toString()}`);

        // const response = await fetch(`/api/templates/searchTemplate`);
        if (!response.ok) throw new Error('Failed to fetch code templates');
        const data = await response.json();
        console.log('Fetched Templates:', data.data);
        setTemplates(data.data as Template[]);
        setCurrentPage(1); // Reset to the first page
    } catch (error) {
        console.error('Error retrieving code templates:', error);
    }
    };
    fetchTemplatesWithFilter();
}, [searchTerm, codeContentSearchTerm, tagsSearchTerm]);
//   useEffect(() => {
//     const applySearchFilter = () => {
//       const filteredTemps = templates.filter((template) =>
//         [template.title, template.explanation, template.code, ...(template.tags || []).map((tag) => tag.name), ...(template.codeTemplates || []).map((template) => template.name)]
//           .join(' ')
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//       setFilteredTemplates(filteredTemps);
//       setCurrentPage(1); // Reset to the first page
//     };
//     applySearchFilter();
//   }, [searchTerm, templates]);

  // Handle sorting
//   const applySorting = (items: Template[]) => {
//     if (sortOption === 'most_controversial') {
//       return items.sort((a, b) => b.downvotes - a.downvotes || a.upvotes - b.upvotes);
//     } else if (sortOption === 'most_valued') {
//       return items.sort((a, b) => b.upvotes - a.upvotes || a.downvotes - b.downvotes);
//     }
//     return items;
//   };

  // Paginate filtered and sorted templates
//   const paginatedTemplates = applySorting(filteredTemplates).slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Code Templates</h1>
        <TemplateSearchBar onSearchChange={setSearchTerm} />
        <TemplateContentSearchBar onSearchChange={setCodeContentSearchTerm} />
        <TemplateTagsSearchBar onSearchChange={setTagsSearchTerm} />
        <TemplateList templates={templates} />
        <TemplatePages
          currentPage={currentPage}
          totalPages={templates.length}
          // totalPages={Math.ceil(filteredPosts.length / pageSize)}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default Template;
