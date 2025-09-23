import React, { Fragment, useEffect } from "react";
import { EditorBubble, useEditor } from "novel";
import AISelector from "./ai-selector";
import { Magic } from "./command";

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

const GenerativeMenuSwitch = ({ children, open, onOpenChange }) => {
  const { editor } = useEditor();

  useEffect(() => {
    if (!open && editor) {
      editor.chain().unsetHighlight().run();
    }
  }, [open, editor]);

  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? "bottom-start" : "top",
        onHidden: () => {
          onOpenChange(false);
          if (editor) {
            editor.chain().unsetHighlight().run();
          }
        },
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md !border !border-dark-stroke bg-dark-bg2 shadow-xl"
    >
      {open && <AISelector open={open} onOpenChange={onOpenChange} />}
      {!open && (
        <Fragment>
          <Button
            className="gap-1 flex items-center justify-center rounded-none text-purple-500 whitespace-nowrap"
            variant="aymane"
            onClick={() => onOpenChange(true)}
            size="sm"
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', whiteSpace: 'nowrap' }}
          >
            <Magic className="h-5 w-5 flex-shrink-0 text-blue-500" />
            <span className="whitespace-nowrap text-blue-500">Ask AI</span>
          </Button>
          {children}
        </Fragment>
      )}
    </EditorBubble>
  );
};

export default GenerativeMenuSwitch;
