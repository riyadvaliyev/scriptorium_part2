import React, { useState } from "react";

interface Template {
  id: number;
  title: string;
}

interface CodeTemplateSelectorProps {
  templates: Template[];
  onSelectionChange: (selectedIds: number[]) => void;
}

const CodeTemplateSelector: React.FC<CodeTemplateSelectorProps> = ({
  templates,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleTemplateClick = (templateId: number) => {
    const updatedSelection = selectedTemplates.includes(templateId)
      ? selectedTemplates.filter((id) => id !== templateId)
      : [...selectedTemplates, templateId];

    setSelectedTemplates(updatedSelection);
    onSelectionChange(updatedSelection); // Notify parent component
  };

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full p-2 border rounded bg-white shadow focus:outline-none"
      >
        Select Code Templates
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-10">
          {/* Search Bar */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border rounded focus:outline-none"
            />
          </div>

          {/* Template Options */}
          <ul>
            {filteredTemplates.map((template) => (
              <li
                key={template.id}
                className="p-2 flex items-center hover:bg-blue-50 cursor-pointer"
                onClick={() => handleTemplateClick(template.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => handleTemplateClick(template.id)}
                  className="mr-2"
                />
                {template.title}
              </li>
            ))}
          </ul>

          {filteredTemplates.length === 0 && (
            <p className="p-2 text-gray-500 text-center">No templates found</p>
          )}
        </div>
      )}

      {/* Selected Templates as Badges */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedTemplates.map((id) => {
          const template = templates.find((t) => t.id === id);
          return (
            <span
              key={id}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
            >
              {template?.title}
              <button
                type="button"
                onClick={() => handleTemplateClick(id)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                &times;
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CodeTemplateSelector;
