import React from 'react';
import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  TextIcon,
  TextQuote,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

// Node Selector Component
export const NodeSelector = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  if (!editor) return null;

  const items = [
    {
      name: "Text",
      icon: TextIcon,
      command: (editor) => editor.chain().focus().clearNodes().run(),
      isActive: (editor) =>
        editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList"),
    },
    {
      name: "Heading 1",
      icon: Heading1,
      command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: Heading2,
      command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "Heading 3",
      icon: Heading3,
      command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
    },
    {
      name: "To-do List",
      icon: CheckSquare,
      command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
      isActive: (editor) => editor.isActive("taskItem"),
    },
    {
      name: "Bullet List",
      icon: ListOrdered,
      command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
      isActive: (editor) => editor.isActive("bulletList"),
    },
    {
      name: "Numbered List",
      icon: ListOrdered,
      command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
      isActive: (editor) => editor.isActive("orderedList"),
    },
    {
      name: "Quote",
      icon: TextQuote,
      command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
      isActive: (editor) => editor.isActive("blockquote"),
    },
    {
      name: "Code",
      icon: Code,
      command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
      isActive: (editor) => editor.isActive("codeBlock"),
    },
  ];

  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-none border-none hover:bg-accent focus:ring-0 px-2 py-1 text-sm"
        onClick={() => onOpenChange(!open)}
      >
        <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-muted rounded-md shadow-lg z-50 p-1">
          {items.map((item) => (
            <EditorBubbleItem
              key={item.name}
              onSelect={(editor) => {
                item.command(editor);
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border p-1">
                  <item.icon className="h-3 w-3" />
                </div>
                <span>{item.name}</span>
              </div>
              {activeItem.name === item.name && <Check className="h-4 w-4" />}
            </EditorBubbleItem>
          ))}
        </div>
      )}
    </div>
  );
};

// Link Selector Component
export const LinkSelector = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  if (!editor) return null;

  return (
    <EditorBubbleItem
      onSelect={(editor) => {
        const url = window.prompt("Enter URL");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      }}
      className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-accent"
    >
      <span className="text-sm">🔗</span>
      <span>Link</span>
    </EditorBubbleItem>
  );
};

// Math Selector Component
export const MathSelector = () => {
  const { editor } = useEditor();
  if (!editor) return null;

  return (
    <EditorBubbleItem
      onSelect={(editor) => {
        const math = window.prompt("Enter math expression");
        if (math) {
          editor.chain().focus().insertContent(`$${math}$`).run();
        }
      }}
      className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-accent"
    >
      <span className="text-sm">∑</span>
      <span>Math</span>
    </EditorBubbleItem>
  );
};

// Text Buttons Component
export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleBold().run()}
        className="flex items-center justify-center w-8 h-8 text-sm hover:bg-accent"
      >
        <strong>B</strong>
      </EditorBubbleItem>
      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
        className="flex items-center justify-center w-8 h-8 text-sm hover:bg-accent"
      >
        <em>I</em>
      </EditorBubbleItem>
      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
        className="flex items-center justify-center w-8 h-8 text-sm hover:bg-accent"
      >
        <s>S</s>
      </EditorBubbleItem>
    </div>
  );
};

// Color Selector Component
export const ColorSelector = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  if (!editor) return null;

  const colors = [
    { name: "Default", color: "inherit" },
    { name: "Red", color: "#ef4444" },
    { name: "Blue", color: "#3b82f6" },
    { name: "Green", color: "#22c55e" },
    { name: "Yellow", color: "#eab308" },
    { name: "Purple", color: "#a855f7" },
  ];

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-accent"
        onClick={() => onOpenChange(!open)}
      >
        <span className="text-sm">🎨</span>
        <span>Color</span>
      </button>
      
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-muted rounded-md shadow-lg z-50 p-2">
          <div className="grid grid-cols-3 gap-1">
            {colors.map((color) => (
              <button
                key={color.name}
                className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                style={{ backgroundColor: color.color }}
                onClick={() => {
                  editor.chain().focus().setColor(color.color).run();
                  onOpenChange(false);
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Separator Component
export const Separator = ({ orientation = "vertical" }) => {
  return (
    <div 
      className={`bg-muted ${
        orientation === "vertical" 
          ? "w-px h-6" 
          : "h-px w-full"
      }`}
    />
  );
};

// Generative Menu Switch Component
export const GenerativeMenuSwitch = ({ open, onOpenChange, children }) => {
  return (
    <div className="flex items-center gap-1">
      {children}
    </div>
  );
};