import { useState, useCallback } from 'react';

/**
 * Custom hook for NovelEditor that provides title extraction and data management
 * @returns {Object} - Object containing title, editorData, and update handler
 */
export const useNovelEditor = () => {
  const [editorData, setEditorData] = useState(null);
  const [title, setTitle] = useState('');
  const [contentWithoutTitle, setContentWithoutTitle] = useState(null);

  // Function to extract title from the first line of editor data (always index 0)
  const extractTitle = useCallback((data) => {    
    if (!data || !data.content || data.content.length === 0) {
      return '';
    }
    
    // Always get the first node (index 0)
    const firstNode = data.content[0];    
    // Extract text content from any node type at index 0
    if (firstNode && firstNode.content) {
      const titleText = firstNode.content
        .map(node => {
          return node.text || '';
        })
        .join('')
        .trim();
      
      return titleText;
    }
    
    return '';
  }, []);

  // Handler for editor updates
  const handleEditorUpdate = useCallback((data) => {
    setEditorData(data);
    
    // Extract title from the first line
    const extractedTitle = extractTitle(data);
    setTitle(extractedTitle);
    
    // Create content without title (remove first node)
    if (data && data.content && data.content.length > 0) {
      const contentWithoutFirstNode = {
        ...data,
        content: data.content.slice(1) // Remove first node (title)
      };
      setContentWithoutTitle(contentWithoutFirstNode);
    } else {
      setContentWithoutTitle(null);
    }
  }, [extractTitle]);

  // Function to get all editor data
  const getEditorData = useCallback(() => {
    return {
      title,
      content: contentWithoutTitle, // Content without title
      fullContent: editorData, // Full content including title
      json: contentWithoutTitle // JSON without title
    };
  }, [title, contentWithoutTitle, editorData]);

  // Function to get just the title
  const getTitle = useCallback(() => {
    return title;
  }, [title]);

  // Function to get just the content (without title)
  const getContent = useCallback(() => {
    return contentWithoutTitle;
  }, [contentWithoutTitle]);

  // Function to get full content (including title)
  const getFullContent = useCallback(() => {
    return editorData;
  }, [editorData]);

  return {
    title,
    editorData,
    contentWithoutTitle,
    handleEditorUpdate,
    getEditorData,
    getTitle,
    getContent,
    getFullContent
  };
};
