import React, { useEffect, useState } from 'react';
import TemplatePages from '@//components/Template/TemplatePages';
import TemplateSearchBar from '@/components/Template/TemplateSearchBar';
import TemplateList from '@/components/Template/TemplateList';
import TemplateExplanationSearchBar from '@/components/Template/TemplateExplanationSearchBar';
import TemplateTagsSearchBar from '@/components/Template/TemplateTagsSearchBar';

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


const TemplatesSection: React.FC = () => {
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  //   const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [codeExplanationSearchTerm, setCodeExplanationSearchTerm] = useState('');
  const [tagsSearchTerm, setTagsSearchTerm] = useState('');
  //   const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalTemplates, setTotalTemplates] = useState(0);
  const [totalFilteredPages, setTotalFilteredPages] = useState(0);
  // const pageNumber = 1;
  const pageSize = 5;

  const fetchTemplatesWithFilter = async () => {
    try {
        let params = new URLSearchParams();
        if (searchTerm) params.append('title', searchTerm);
        if (codeExplanationSearchTerm) params.append('explanation', codeExplanationSearchTerm);
        // filter tags:
        if (tagsSearchTerm) {
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
        }
        params.append('page', String(currentPage)); // Add default pagination
        params.append('pageSize', String(pageSize)); // Add default pagination

        // console.log("api literal:", `/api/templates/searchTemplate?${params.toString()}`);
        const response = await fetch(`/api/templates/viewSearchTemplate?${params.toString()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });

        // const response = await fetch(`/api/templates/searchTemplate`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch code templates!");
        }
        const data = await response.json();
        // setCurrentPage(1); // Reset to the first page
        // setTotalTemplates(data.meta.filteredTotalCount);
        setTotalFilteredPages(data.meta.filteredTotalPageCount);
        // console.log('totalTemplates:', totalTemplates);
        // console.log('total_count:', totalCount);
        // console.log('Fetched Templates:', data.data);
        setTemplates(data.data as Template[]);

        if (totalFilteredPages === 0) {
            // No results: Reset currentPage to 1
            setCurrentPage(1);
          } else if (currentPage > totalFilteredPages) {
            // Current page exceeds valid range: Reset to the last valid page
            setCurrentPage(totalFilteredPages);
          }
    } catch (error) {
        console.error('Error retrieving code templates:', error);
        setError('Failed to load code templates.');
    }
};

  useEffect(() => {
      fetchTemplatesWithFilter();
  }, [searchTerm, codeExplanationSearchTerm, tagsSearchTerm, currentPage]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
  <>
    <div className="container mx-auto p-2">
      <TemplateSearchBar onSearchChange={setSearchTerm} />
      <TemplateExplanationSearchBar onSearchChange={setCodeExplanationSearchTerm} />
      <TemplateTagsSearchBar onSearchChange={setTagsSearchTerm} />
      <TemplateList templates={templates} />
      <TemplatePages
        currentPage={currentPage}
        totalPages={totalFilteredPages}
        onPageChange={setCurrentPage}
      />
    </div>
  </>
  );

  // useEffect(() => {
  //   const fetchTemplates = async () => {
  //     try {
  //       const response = await fetch('/api/templates/viewSearchTemplate', {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch templates');
  //       }

  //       const data: Template[] = await response.json();

  //       // Ensure data is an array and set state
  //       setTemplates(Array.isArray(data) ? data : []);
  //     } catch (err) {
  //       console.error('Error fetching templates:', err);
  //       setError('Failed to load templates.');
  //     }
  //   };

  //   fetchTemplates();
  // }, []);

  // if (error) return <p className="text-red-500">{error}</p>;

  // return (
  //   <div className="my-6">
  //     {templates.length === 0 ? (
  //       <p className="text-gray-500">No templates available. Create one now!</p>
  //     ) : (
  //       <ul className="space-y-4">
  //         {templates.map((template) => (
  //           <li key={template.id} className="p-4 border rounded shadow">
  //             <h3 className="text-xl font-semibold">{template.title}</h3>
  //             <p className="text-sm text-gray-500">Created on: {new Date(template.createdAt).toLocaleDateString()}</p>
  //           </li>
  //         ))}
  //       </ul>
  //     )}
  //   </div>
  // );
};

export default TemplatesSection;





