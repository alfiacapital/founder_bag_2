import React, { useEffect, useState, useMemo } from 'react';
import {useParams} from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios.jsx";
import { NovelEditor } from '@/components/novel-editor';

function Note() {
    const {id} = useParams();
    const queryClient = useQueryClient();
    
    const {data: note, isLoading} = useQuery({
        queryKey: ["note", id],
        queryFn: async () => {
            const res = await axiosClient.get(`/notes/${id}`)
            return res.data
        },
    });

    // Convert note data to editor format (description only)
    const editorInitialContent = useMemo(() => {
        if (!note) return null;

        const editorContent = {
            type: "doc",
            content: []
        };

        // Add description content if it exists
        if (note.description) {
            try {
                // Try to parse description as JSON (if it's stored as rich text)
                const parsedDescription = JSON.parse(note.description);
                if (parsedDescription && parsedDescription.content && parsedDescription.content.length > 0) {
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

        // Always return the content, even if empty - NovelEditor will handle empty case
        console.log('Editor initial content for note:', note._id, editorContent); // Debug log
        return editorContent;
    }, [note]);

    // Handle editor updates and save to backend
    const handleEditorUpdateWithSave = (data) => {
        // Save to backend
        if (note && data) {
            const titleText = data.title || '';
            const content = data.content || { type: "doc", content: [] };
            
            // Update note in backend
            axiosClient.put(`/notes/${id}`, {
                title: titleText,
                description: JSON.stringify(content)
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
                key={`${id}-${note.updatedAt}`} // Force re-render when note ID or update time changes
                onUpdate={handleEditorUpdateWithSave}
                placeholder="Start writing..."
                showStatusBar={true}
                autoSave={true}
                initialContent={editorInitialContent}
                initialTitle={note.title || "📝 New Note"}
            />
        </div>
    );
}

export default Note;
