import React from 'react';
import { NovelEditor } from '../components/novel-editor';
import { useNovelEditor } from '../hooks/useNovelEditor';

const NovelEditorDemo = () => {
  const { handleEditorUpdate } = useNovelEditor();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <NovelEditor
            onUpdate={handleEditorUpdate}
            placeholder="Start writing... Type '/' for commands"
            showStatusBar={true}
            autoSave={true}
            className="shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default NovelEditorDemo;
