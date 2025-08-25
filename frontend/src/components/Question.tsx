// Question.tsx
// Renders a single survey question

import React from 'react';

type QuestionProps = {
  title: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
};

const Question: React.FC<QuestionProps> = ({ title, description, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{title}</label>
      {description && <div className="text-sm text-gray-500 mb-1">{description}</div>}
      <input
        className="border rounded px-2 py-1 w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default Question;
