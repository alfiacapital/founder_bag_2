import React, { useState, useEffect, useRef } from "react";
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

// Simple Button component
const Button = ({ children, className = "", size = "sm", variant = "ghost", onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    icon: "h-10 w-10",
  };
  const variantClasses = {
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    aymane: "  text-dark-text2 hover:bg-[#181818] hover:text-white",

  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

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

export const NodeSelector = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  
  if (!editor) return null;
  
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      
      // dropdown.style.position = 'fixed';
      // dropdown.style.top = `${buttonRect.bottom + 2}px`;
      // dropdown.style.left = `${buttonRect.left}px`;
      // dropdown.style.zIndex = '9999';
    }
  }, [isOpen]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onOpenChange(newOpen);
  };

  return (
    <div className="relative" style={{ position: 'relative' }}>
      <Button 
        ref={buttonRef}
        size="sm" 
        variant="aymane" 
        className="gap-2 rounded-none border-none  focus:ring-0"
        onClick={handleToggle}
      >
        <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed rounded-md border border-dark-stroke bg-dark-bg2 p-1 text-gray-900 shadow-lg"
          style={{
            minWidth: '192px',
            // backgroundColor: 'white',
            // borderColor: '#e5e7eb',
            // borderRadius: '0.375rem',
            // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '0.25rem',
            zIndex: 9999
          }}
        >
          {items.map((item) => (
            <EditorBubbleItem
              key={item.name}
              onSelect={(editor) => {
                item.command(editor);
                setIsOpen(false);
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-dark-hover text-dark-text2 hover:text-white"
            >
              <div className="flex items-center space-x-2 ">
                <div className="rounded-sm border border-dark-stroke p-1">
                  <item.icon className="h-3 w-3 " />
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