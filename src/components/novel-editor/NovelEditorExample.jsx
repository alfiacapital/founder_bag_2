import React, { useState } from 'react';
import { NovelEditor } from './NovelEditor';

// Simple example of how to use NovelEditor in any component
const NovelEditorExample = () => {
  const [content, setContent] = useState(null);

  const handleUpdate = (data) => {
    setContent(data);
    console.log('Content updated:', data);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Novel Editor Example</h2>
      
      {/* Basic usage */}
      <NovelEditor
        onUpdate={handleUpdate}
        placeholder="Start writing your content here..."
        showStatusBar={true}
        showWordCount={true}
        autoSave={true}
      />
      
      {/* Display content info */}
      {content && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Content Info:</h3>
          <p>Words: {content.wordCount}</p>
          <p>Characters: {content.charCount}</p>
        </div>
      )}
    </div>
  );
};

export default NovelEditorExample;
