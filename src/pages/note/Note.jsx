import React, { useEffect, useState, useMemo } from 'react';
import {useParams} from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios.jsx";
import { NovelEditor } from '@/components/novel-editor';
import { useNovelEditor } from '@/hooks/useNovelEditor';

function Note() {
    const {id} = useParams();
    const queryClient = useQueryClient();
    const { title, editorData, contentWithoutTitle, handleEditorUpdate } = useNovelEditor();
    
    const {data: note, isLoading} = useQuery({
        queryKey: ["note", id],
        queryFn: async () => {
            const res = await axiosClient.get(`/notes/${id}`)
            return res.data
        },
    });

    // Convert note data to editor format
    const editorInitialContent = useMemo(() => {
        if (!note) return null;

        const editorContent = {
            type: "doc",
            content: []
        };

        // Add title as first line (H1 heading)
        if (note.title) {
            editorContent.content.push({
                type: "heading",
                attrs: { level: 1 },
                content: [{
                    type: "text",
                    text: note.title
                }]
            });
        } else {
            // Add empty H1 if no title
            editorContent.content.push({
                type: "heading",
                attrs: { level: 1 },
                content: []
            });
        }

        // Add description content if it exists
        if (note.description) {
            try {
                // Try to parse description as JSON (if it's stored as rich text)
                const parsedDescription = JSON.parse(note.description);
                if (parsedDescription && parsedDescription.content) {
                    editorContent.content.push(...parsedDescription.content);
                } else {
                    // If it's plain text, add as paragraph
                    editorContent.content.push({
                        type: "paragraph",
                        content: [{
                            type: "text",
                            text: note.description
                        }]
                    });
                }
            } catch (e) {
                // If parsing fails, treat as plain text
                editorContent.content.push({
                    type: "paragraph",
                    content: [{
                        type: "text",
                        text: note.description
                    }]
                });
            }
        }

        return editorContent;
    }, [note]);

    // Handle editor updates and save to backend
    const handleEditorUpdateWithSave = (data) => {
        handleEditorUpdate(data);
        
        // Save to backend
        if (note && data) {
            const titleText = title || '';
            const contentWithoutTitle = data.content && data.content.length > 1 
                ? { ...data, content: data.content.slice(1) } 
                : { type: "doc", content: [] };
            
            // Update note in backend
            axiosClient.put(`/notes/${id}`, {
                title: titleText,
                description: JSON.stringify(contentWithoutTitle)
            }).then(() => {
                // Invalidate notes query to refresh the sidebar with updated title
                queryClient.invalidateQueries({ queryKey: ["notes"] });
            }).catch(error => {
                console.error('Error saving note:', error);
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-white">Loading note...</div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-white">Note not found</div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <NovelEditor
                key={id} // Force re-render when note ID changes
                onUpdate={handleEditorUpdateWithSave}
                placeholder="Start writing..."
                showStatusBar={true}
                autoSave={true}
                initialContent={editorInitialContent}
            />
        </div>
    );
}

export default Note;
