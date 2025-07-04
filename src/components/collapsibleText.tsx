import React, { useState } from 'react';

interface CollapsibleTextProps {
  text: string;
  cutoff?: number;
}

export default function CollapsibleText({ text, cutoff = 100 }: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > cutoff;
  const firstPart = isLong ? text.slice(0, cutoff) : text;

  return (
    <div>
      <p className="text-gray-700">{isExpanded || !isLong ? text : `${firstPart}...`}</p>
      {isLong && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-sm text-indigo-600 hover:underline"
        >
          {isExpanded ? 'Læs mindre' : 'Læs mere'}
        </button>
      )}
    </div>
  );
}
