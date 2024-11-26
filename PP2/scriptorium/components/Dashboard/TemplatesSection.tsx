import React, { useEffect, useState } from 'react';

interface Template {
  id: number;
  title: string;
  explanation: string;
  createdAt: string;
}

const TemplatesSection: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]); // Initialize as an empty array
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates/viewSearchTemplate', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data: Template[] = await response.json();

        // Ensure data is an array and set state
        setTemplates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates.');
      }
    };

    fetchTemplates();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="my-6">
      {templates.length === 0 ? (
        <p className="text-gray-500">No templates available. Create one now!</p>
      ) : (
        <ul className="space-y-4">
          {templates.map((template) => (
            <li key={template.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{template.title}</h3>
              <p className="text-sm text-gray-500">Created on: {new Date(template.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TemplatesSection;





