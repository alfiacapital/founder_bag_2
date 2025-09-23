import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
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

const TEXT_COLORS = [
  {
    name: "Default",
    color: "#fff",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS = [
  {
    name: "Default",
    color: "#ffffff",
  },
  {
    name: "Purple",
    color: "#e9d5ff",
  },
  {
    name: "Red",
    color: "#fecaca",
  },
  {
    name: "Yellow",
    color: "#fef3c7",
  },
  {
    name: "Blue",
    color: "#dbeafe",
  },
  {
    name: "Green",
    color: "#d1fae5",
  },
  {
    name: "Orange",
    color: "#fed7aa",
  },
  {
    name: "Pink",
    color: "#fce7f3",
  },
  {
    name: "Gray",
    color: "#f3f4f6",
  },
];

export const ColorSelector = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));

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
    console.log('Color selector clicked, current isOpen:', isOpen);
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onOpenChange(newOpen);
    console.log('Color selector new isOpen:', newOpen);
  };

  return (
    <div className="relative" style={{ position: 'relative' }}>
      <Button 
        ref={buttonRef}
        size="sm" 
        className="gap-2 rounded-none " 
        variant="aymane"
        onClick={handleToggle}
      >
        <span
          className="rounded-sm px-1 "
          style={{
            color: activeColorItem?.color,
            backgroundColor: activeHighlightItem?.color,
          }}
        >
          A
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed flex max-h-80 flex-col overflow-hidden overflow-y-auto rounded border border-dark-stroke bg-dark-bg2 p-1 text-gray-900 shadow-lg"
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
          <div className="flex flex-col">
            <div className="my-1 px-2 text-sm font-semibold text-white">Color</div>
            {TEXT_COLORS.map(({ name, color }) => (
              <EditorBubbleItem
                key={name}
                onSelect={() => {
                  editor.commands.unsetColor();
                  name !== "Default" &&
                    editor
                      .chain()
                      .focus()
                      .setColor(color || "")
                      .run();
                  setIsOpen(false);
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-dark-hover text-dark-text2 hover:text-white rounded-button mb-1 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-sm border px-2 py-px font-medium" style={{ color }}>
                    A
                  </div>
                  <span >{name}</span>
                </div>
              </EditorBubbleItem>
            ))}
          </div>
          <div>
            <div className="my-1 px-2 text-sm font-semibold text-white">Background</div>
            {HIGHLIGHT_COLORS.map(({ name, color }) => (
              <EditorBubbleItem
                key={name}
                onSelect={() => {
                  editor.commands.unsetHighlight();
                  name !== "Default" && editor.chain().focus().setHighlight({ color }).run();
                  setIsOpen(false);
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-dark-hover text-dark-text2 hover:text-white rounded-button mb-1 py-1.5"
              >
                <div className="flex items-center gap-2 ">
                  <div className="rounded-sm border px-2 py-px font-medium" style={{ backgroundColor: color }}>
                    A
                  </div>
                  <span>{name}</span>
                </div>
                {editor.isActive("highlight", { color }) && <Check className="h-4 w-4" />}
              </EditorBubbleItem>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};