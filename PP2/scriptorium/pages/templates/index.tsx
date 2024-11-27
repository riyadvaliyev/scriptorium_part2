import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Shared/Navbar';
import TemplatePages from '@//components/Template/TemplatePages';
import TemplateSearchBar from '@/components/Template/TemplateSearchBar';
import TemplateList from '@/components/Template/TemplateList';
import TemplateContentSearchBar from '@/components/Template/TemplateContentSearchBar';
import TemplateTagsSearchBar from '@/components/Template/TemplateTagsSearchBar';
import { pages } from 'next/dist/build/templates/app-page';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [codeContentSearchTerm, setCodeContentSearchTerm] = useState('');
    const [tagsSearchTerm, setTagsSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFilteredPages, setTotalFilteredPages] = useState(0);
    const pageSize = 7;

    const fetchTemplatesWithFilter = async () => {
        try {
            let params = new URLSearchParams();
            if (searchTerm) params.append('title', searchTerm);
            if (codeContentSearchTerm) params.append('content', codeContentSearchTerm);
            // filter tags:
            if (tagsSearchTerm) {
                // console.log("in tagsSearchTerm");
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
                // console.log("tags:", tags);
                // console.log("params:", params);
            }
            params.append('page', String(currentPage)); // Add default pagination
            params.append('pageSize', String(pageSize)); // Add default pagination

            // console.log("api literal:", `/api/templates/searchTemplate?${params.toString()}`);
            const response = await fetch(`/api/templates/searchTemplate?${params.toString()}`);

            // const response = await fetch(`/api/templates/searchTemplate`);
            if (!response.ok) throw new Error('Failed to fetch code templates');
            const data = await response.json();
            setTotalFilteredPages(data.meta.filteredTotalPageCount);
            // console.log('totalTemplates:', totalTemplates);
            // console.log('totalFilteredPages:', totalFilteredPages);
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
        }
    };

    useEffect(() => {
        fetchTemplatesWithFilter();
    }, [searchTerm, codeContentSearchTerm, tagsSearchTerm, currentPage]);

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
          totalPages={totalFilteredPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default Template;
