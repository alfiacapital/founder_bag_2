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
import EmojiPicker from './EmojiPicker.jsx';
// Combine extensions with slash command
const extensions = [...defaultExtensions, slashCommand];
import './novel-editor.css';
import './editor-content.css';
import './editor-menus.css';

// Simple upload function - you can customize this for your backend
const uploadFn = async (file) => {
  return URL.createObjectURL(file);
};

// Default content for the editor - Description only (no title)
const defaultEditorContent = {
  type: "doc",
  content: []
};

const NovelEditor = ({
  className = "",
  showStatusBar = true,
  autoSave = true,
  saveDelay = 500,
  onUpdate = null,
  initialContent: propInitialContent = null,
  initialTitle = "📝 New Note" // New prop for initial title
}) => {
  const [initialContent, setInitialContent] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const editorRef = useRef(null);
  
  // Title state (separate from editor)
  const [titleText, setTitleText] = useState('');
  const [titleEmoji, setTitleEmoji] = useState('📝');
  
  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });
  
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

  // Initialize title from prop
  useEffect(() => {
    if (initialTitle) {
      const emojiMatch = initialTitle.match(/^(\p{Emoji})\s*(.*)/u);
      if (emojiMatch) {
        setTitleEmoji(emojiMatch[1]);
        setTitleText(emojiMatch[2] || '');
      } else {
        setTitleEmoji('📝');
        setTitleText(initialTitle);
      }
    }
  }, [initialTitle]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setTitleEmoji(emoji);
    setShowEmojiPicker(false);
    
    // Trigger auto-save
    const fullTitle = emoji + (titleText ? ' ' + titleText : '');
    if (onUpdate) {
      onUpdate({ title: fullTitle, content: editorRef.current?.getJSON() });
    }
  };

  // Handle title text change
  const handleTitleChange = (e) => {
    const newText = e.target.value;
    setTitleText(newText);
    
    // Trigger auto-save
    const fullTitle = titleEmoji + (newText ? ' ' + newText : '');
    if (onUpdate) {
      onUpdate({ title: fullTitle, content: editorRef.current?.getJSON() });
    }
  };

  // Handle Enter key in title input to focus editor
  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Try to find and focus the editor element directly
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        editorElement.focus();
      }
    }
  };

  // Handle emoji click
  const handleEmojiClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.target.getBoundingClientRect();
    setEmojiPickerPosition({
      top: rect.bottom + 5,
      left: rect.left
    });
    setShowEmojiPicker(true);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

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

    setSaveStatus("Saved");

    // Call the onUpdate prop if provided
    if (onUpdate) {
      const fullTitle = titleEmoji + (titleText ? ' ' + titleText : '');
      onUpdate({ title: fullTitle, content: json });
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
      console.log('Updating editor content:', initialContent); // Debug log
      
      // Force a complete content update
      setTimeout(() => {
        editorRef.current.commands.setContent(initialContent);
        console.log('Content set, current editor content:', editorRef.current.getJSON()); // Debug log
      }, 50);
    }
  }, [initialContent]);

  if (!initialContent) return null;

  return (
    <div className={`novel-editor w-full min-h-screen ${className}`}>
      {/* Separate Title Input */}
      <div className="w-full ">
        <div className="title-input-container flex items-center ">
          <button
            onClick={handleEmojiClick}
            className="emoji-button "
            type="button"
          >
            {titleEmoji}
          </button>
          <input
            type="text"
            value={titleText}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled" 
            className="title-input focus:outline-none text-[4rem] font-bold"
            autoFocus
          />
        </div>
      </div>

      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-screen w-full pl-4"
          editorProps={{
            handleDOMEvents: {
              keydown: (view, event) => {
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
              const fullTitle = titleEmoji + (titleText ? ' ' + titleText : '');
              onUpdate({ title: fullTitle, content: data });
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
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
          position={emojiPickerPosition}
        />
      )}
    </div>
  );
};

export default NovelEditor;
