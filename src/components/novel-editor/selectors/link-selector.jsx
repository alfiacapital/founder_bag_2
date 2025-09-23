import React, { useEffect, useRef, useState } from "react";
import { Check, Trash } from "lucide-react";
import { useEditor } from "novel";

// Simple Button component
const Button = ({ children, className = "", size = "sm", variant = "ghost", type = "button", onClick, ...props }) => {
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
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}

export function getUrlFromString(str) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (_e) {
    return null;
  }
}

export const LinkSelector = ({ open, onOpenChange }) => {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const { editor } = useEditor();
  const [isOpen, setIsOpen] = useState(false);

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
      
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${buttonRect.bottom + 2}px`;
      dropdown.style.left = `${buttonRect.left}px`;
      dropdown.style.zIndex = '9999';
    }
  }, [isOpen]);

  // Autofocus on input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  if (!editor) return null;

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
        className="gap-2 rounded-none border-none"
        onClick={handleToggle}
      >
        <p className="text-base">↗</p>
        <p
          className={`underline decoration-stone-400 underline-offset-4 ${
            editor.isActive("link") ? "text-blue-500" : ""
          }`}
        >
          Link
        </p>
      </Button>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed rounded-md border bg-white p-0 text-gray-900 shadow-lg"
          style={{
            minWidth: '240px',
            backgroundColor: 'white',
            borderColor: '#e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 9999
          }}
        >
          <form
            onSubmit={(e) => {
              const target = e.currentTarget;
              e.preventDefault();
              const input = target[0];
              const url = getUrlFromString(input.value);
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
                setIsOpen(false);
                onOpenChange(false);
              }
            }}
            className="flex p-1"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Paste a link"
              className="flex-1 bg-background p-1 text-sm outline-none"
              defaultValue={editor.getAttributes("link").href || ""}
            />
            {editor.getAttributes("link").href ? (
              <Button
                size="icon"
                variant="outline"
                type="button"
                className="flex h-8 items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  inputRef.current.value = "";
                  setIsOpen(false);
                  onOpenChange(false);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="icon" className="h-8">
                <Check className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};