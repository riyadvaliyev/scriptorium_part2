import React from 'react';
import { useRouter } from 'next/router';

// Define the Template type
interface Tag {
    id: number;
    name: string;
}

interface TemplateTagProps {
  tags?: Tag[];
}

const TemplateTags: React.FC<TemplateTagProps> = ({ tags = [] }) => {
  const router = useRouter();

  if (tags.length === 0) {
    return <p className="text-gray-500">No tags available.</p>;
  }

//   const truncateContent = (explanation: string, limit: number) => {
//     return explanation.length > limit ? `${explanation.substring(0, limit)}...` : explanation;
//   };
  var tagNameLimit = 25;
  var tagLimit = 5;

  const truncateTagName = (name: string, limit: number = 25) => {
    tagNameLimit = limit;
    return name.length > limit ? `${name.substring(0, limit)}...` : name;
  }

  const truncateTags = (tags: Tag[], limit: number = 5) => {
    tagLimit = limit;
    return tags.length > limit ? tags.slice(0, limit) : tags;
  }

  return (
    <ul className="space-y-4">
      {truncateTags(tags, 5).map((tag) => (
        <div key={tag.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          {truncateTagName(tag.name, 25)}
        </div>
        ))}
        <span className="text-gray-500">
            {tags.length > tagLimit ? `and ${tags.length - tagLimit } more` : ''}
        </span>
    </ul>
  );
};

export default TemplateTags;
