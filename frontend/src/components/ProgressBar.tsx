// ProgressBar.tsx
// Shows progress through the survey (optional improvement)

import React from 'react';

type ProgressBarProps = {
  current: number;
  total: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percent = (current / total) * 100;
  return (
    <div className="w-full bg-gray-200 rounded h-2 mb-4">
      <div
        className="bg-blue-500 h-2 rounded"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
