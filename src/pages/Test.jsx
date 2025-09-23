import React, { useEffect } from 'react';
import { NovelEditor } from '../components/novel-editor';
import { useNovelEditor } from '../hooks/useNovelEditor';

export default function Test() {
    const { title, editorData, contentWithoutTitle, handleEditorUpdate } = useNovelEditor();

    useEffect(() => {
        if (editorData) {
            console.log('📝 Title:', title);
            console.log('📄 Content (without title):', contentWithoutTitle);
        }
    }, [editorData, title, contentWithoutTitle]);


    return (
        <div className="">

            {/* Editor */}
            <NovelEditor
                onUpdate={handleEditorUpdate}
                placeholder="Start writing..."
                showStatusBar={true}
                autoSave={true}
            />
        </div>
    );
}

