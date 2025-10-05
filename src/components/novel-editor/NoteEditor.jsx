import React, { useEffect, useState, useRef } from 'react';
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  ImageResizer,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from 'novel';
import { useDebouncedCallback } from 'use-debounce';
import { defaultExtensions } from './extensions';
import { slashCommand, suggestionItems } from './slash-command.jsx';
import { NodeSelector } from './selectors/node-selector.jsx';
import { TextButtons } from './selectors/text-buttons.jsx';
import { LinkSelector } from './selectors/link-selector.jsx';
import { ColorSelector } from './selectors/color-selector.jsx';
import { MathSelector } from './selectors/math-selector.jsx';
import { Separator } from './selectors/separator.jsx';
import GenerativeMenuSwitch from './selectors/generative-menu-switch.jsx';
// Combine extensions with slash command
const extensions = [...defaultExtensions, slashCommand];
import './novel-editor.css';
import './editor-content.css';
import './editor-menus.css';

// Simple upload function - you can customize this for your backend
const uploadFn = async (file) => {
  return URL.createObjectURL(file);
};

// Default content for the editor
const defaultEditorContent = {
  type: "doc",
  content: []
};

const NoteEditor = ({
  className = "",
  autoSave = true,
  saveDelay = 500,
  onUpdate = null,
  initialContent: propInitialContent = null,
  placeholder = "Start writing..."
}) => {
  const [initialContent, setInitialContent] = useState(null);
  const editorRef = useRef(null);
  
  // Bubble menu state
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();

    // Call the onUpdate prop if provided
    if (onUpdate) {
      onUpdate({ content: json });
    }
  }, saveDelay);

  useEffect(() => {
    // Always ensure we have at least an empty paragraph for placeholder
    const content = propInitialContent || defaultEditorContent;
    if (!content.content || content.content.length === 0) {
      setInitialContent({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: []
          }
        ]
      });
    } else {
      setInitialContent(content);
    }
  }, [propInitialContent]);

  // Update editor content when initialContent changes
  useEffect(() => {
    if (initialContent && editorRef.current) {
      // Force a complete content update
      setTimeout(() => {
        editorRef.current.commands.setContent(initialContent);
      }, 50);
    }
  }, [initialContent]);

  if (!initialContent) return null;

  return (
    <div className={`note-editor w-full h-full ${className}`}>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative h-full w-full px-2"
          editorProps={{
            handleDOMEvents: {
              keydown: (view, event) => {
                handleCommandNavigation(event);
              },
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: "prose prose-sm dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full h-full",
              placeholder: placeholder,
            },
          }}
          onCreate={({ editor }) => {
            editorRef.current = editor;
            
            // Ensure editor has an empty paragraph for placeholder to show
            setTimeout(() => {
              const editorData = editor.getJSON();
              if (!editorData.content || editorData.content.length === 0) {
                editor.commands.insertContent({
                  type: "paragraph",
                  content: []
                });
              }
            }, 100);
          }}
          onUpdate={({ editor }) => {
            // Call onUpdate immediately for real-time updates
            if (onUpdate) {
              const data = editor.getJSON();
              onUpdate({ content: data });
            }

            debouncedUpdates(editor);
          }}
          slotAfter={<ImageResizer />}
        >
          {/* Slash Command Menu */}
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {/* Bubble Menu - Text Selection Toolbar */}
          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>

        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default NoteEditor;

