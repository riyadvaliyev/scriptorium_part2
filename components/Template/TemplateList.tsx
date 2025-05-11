import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TemplateTags from './TemplateTags';

const languages = {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    lisp: 'Lisp',
    ruby: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    c: 'C',
    'c++': 'C++',
    r: 'R',
}

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
        email?: string;
    };
    tags?: { 
        id: number;
        name: string 
    }[];
    codeTemplateChildren?: { name: string }[];
}

interface TemplateListProps {
  templates?: Template[];
}

// interface Tag {
//     id: number;
//     name: string;
// }

const RunButton = ({ template }: { template: Template }) => {
  const router = useRouter();

  const title = template.title;
  const explanation = template.explanation;
  const code = template.code;
  const language = template.language;
  const author = template.user?.email || "";
  let tagString = "";

  // convert tags to a string, comma separated
  template.tags?.forEach((tag) => {
    tagString += tag.name + ", ";
  });

  const handleRunClick = () => {
    localStorage.setItem('editorData', JSON.stringify({
      templateId: template.id,
      title: title,
      explanation: explanation,
      code: code,
      language: language,
      tags: tagString,
      author: author,
  }));

    router.push({ pathname: `/editor/${template.id}` });
  }

  return (
    <button 
      onClick={handleRunClick}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
      View ▶
    </button>
  );
}

const TemplateList: React.FC<TemplateListProps> = ({ templates = [] }) => {
  const router = useRouter();

  const [visibleCodes, setVisibleCodes] = React.useState<{ [key: number]: boolean }>({});

  if (templates.length === 0) {
    return <p className="text-gray-500">No templates available.</p>;
  }

  const truncateContent = (explanation: string, limit: number) => {
    return explanation.length > limit ? `${explanation.substring(0, limit)}...` : explanation;
  };

  // used gpt here
  const toggleCodeVisibility = (id: number) => {
    setVisibleCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  }

//   console.log('firstname:', templates[0].user?.firstName);

  return (
    <ul className="space-y-4">
      {templates.map((template) => (
        <li key={template.id} className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">{template.title}</h3>
          <p className="text-sm text-gray-500">
            {template.user
                ? `By ${template.user.firstName || 'Unknown'} ${template.user.lastName || 'Author'}`
                : 'By Unknown Author'}{' in '}
            <span className="text-blue-500">
                {template.language
                ? languages[template.language as keyof typeof languages]
                : 'Unknown Language'}
            </span>
          </p>
          <p className="mt-2">{truncateContent(template.explanation, 300)}</p>
            <div className="mt-4">
                <TemplateTags tags={template.tags} />
            </div>
          <div className="mt-4">
            {/* the show more button */}
            <button
              className="text-blue-500 hover:underline mb-2"
              onClick={() => toggleCodeVisibility(template.id)}
            >
              {visibleCodes[template.id] ? 'Hide Code' : 'Show Code'}
            </button>
            {/* reveals the code with overflow */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                visibleCodes[template.id] ? 'max-h-screen' : 'max-h-0'
              }`}
            >
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
                <code>{template.code}</code>
              </pre>
            </div>
        </div>
          <div className="mt-4 flex justify-between items-center">
            <RunButton template={template} />
            {/* <Link href={`/editor/${template.id}`}>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Run ▶
                </button>
            </Link> */}
            {/* <button
              className="text-blue-500 hover:underline"
              onClick={() => router.push(`/template/${template.id}`)}
            >
              Read More
            </button> */}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TemplateList;




