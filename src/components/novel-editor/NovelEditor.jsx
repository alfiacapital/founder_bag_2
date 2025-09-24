import React, { useEffect, useState, useRef } from 'react';
import {
  EditorBubble,
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

// Default content for the editor - First line is always H1 title (empty)
const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: []
    },
  ]
};

const NovelEditor = ({
  className = "",
  showStatusBar = true,
  autoSave = true,
  saveDelay = 500,
  onUpdate = null,
  initialContent: propInitialContent = null
}) => {
  const [initialContent, setInitialContent] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const editorRef = useRef(null);
  
  // Bubble menu state
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  // Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // Simple syntax highlighting - you can enhance this
      el.style.backgroundColor = "#f8f9fa";
      el.style.padding = "0.2em 0.4em";
      el.style.borderRadius = "3px";
    });
    return new XMLSerializer().serializeToString(doc);
  };

  // Ensure first line is always H1 and can't be deleted
  const ensureFirstLineIsH1 = (editor) => {
    const { state } = editor;
    const firstChild = state.doc.firstChild;

    if (!firstChild || firstChild.type.name !== "heading" || firstChild.attrs.level !== 1) {
      const tr = state.tr;
      tr.replaceWith(0, firstChild ? firstChild.nodeSize : 0, state.schema.nodes.heading.create({ level: 1 }));
      editor.view.dispatch(tr);
    }
  };

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();

    // Ensure first line is always H1
    ensureFirstLineIsH1(editor);

    setSaveStatus("Saved");

    // Call the onUpdate prop if provided
    if (onUpdate) {
      onUpdate(json);
    }
  }, saveDelay);

  // Handle special keydown behavior for title line
  const handleTitleKeydown = (view, event) => {
    const { state, dispatch } = view;
    const { selection } = state;
    const { $from } = selection;

    // Check if we're in the first line (title)
    const isInFirstLine = $from.depth === 1 && $from.parent === state.doc.firstChild;

    if (isInFirstLine) {
      // Allow Enter key only if there's text in the title
      if (event.key === 'Enter') {
        const titleText = $from.parent.textContent.trim();
        if (titleText.length === 0) {
          // Prevent Enter if title is empty
          event.preventDefault();
          return true;
        }
        // Allow Enter if title has text - this will create a new paragraph below
      }

      // Prevent slash commands in title
      if (event.key === '/') {
        event.preventDefault();
        return true;
      }

      // Prevent bullet lists, numbered lists, etc. in title
      if (event.key === '-' || event.key === '*') {
        event.preventDefault();
        return true;
      }

      // Prevent Backspace/Delete from deleting the entire title line
      if ((event.key === 'Backspace' || event.key === 'Delete') && $from.parent.textContent.length === 0) {
        event.preventDefault();
        return true;
      }

      // Prevent Backspace at the beginning of title when title is empty
      if (event.key === 'Backspace' && $from.parentOffset === 0 && $from.parent.textContent.length === 0) {
        event.preventDefault();
        return true;
      }
    }

    // Prevent deletion of the first line entirely
    if (event.key === 'Backspace' && $from.depth === 1 && $from.parent === state.doc.firstChild) {
      const titleText = $from.parent.textContent;
      if (titleText.length === 0 || ($from.parentOffset === 0 && titleText.length === 1)) {
        event.preventDefault();
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    setInitialContent(propInitialContent || defaultEditorContent);
  }, [propInitialContent]);

  // Update editor content when initialContent changes
  useEffect(() => {
    if (initialContent && editorRef.current) {
      editorRef.current.commands.setContent(initialContent);
    }
  }, [initialContent]);

  if (!initialContent) return null;

  return (
    <div className={`novel-editor w-full min-h-screen ${className}`}>


      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-screen w-full max-w-4xl mx-auto px-8 py-8"
          editorProps={{
            handleDOMEvents: {
              keydown: (view, event) => {
                // Handle special behavior for first line (title)
                handleTitleKeydown(view, event);
                handleCommandNavigation(event);
              },
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full min-h-screen",
            },
            transformPastedHTML: (html) => {
              // Ensure pasted content doesn't replace the title
              return html;
            },
          }}
          onCreate={({ editor }) => {
            editorRef.current = editor;
            // Add transaction filter to prevent deletion of first line
            editor.view.dom.addEventListener('keydown', (event) => {
              if (event.key === 'Backspace' || event.key === 'Delete') {
                const { state } = editor;
                const { selection } = state;
                const { $from } = selection;

                // If trying to delete the first line entirely
                if ($from.depth === 1 && $from.parent === state.doc.firstChild) {
                  const titleText = $from.parent.textContent;
                  if (titleText.length === 0 || ($from.parentOffset === 0 && titleText.length === 1)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }
              }
            });
          }}
          onUpdate={({ editor }) => {
            // Call onUpdate immediately for real-time updates
            if (onUpdate) {
              const data = editor.getJSON();
              onUpdate(data);
            }

            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          {/* Slash Command Menu - exactly like TailwindAdvancedEditor */}
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

export default NovelEditor;
