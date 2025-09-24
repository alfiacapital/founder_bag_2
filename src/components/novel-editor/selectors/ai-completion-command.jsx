import React from "react";
import { CommandGroup, CommandItem, CommandSeparator } from "./command";
import { useEditor } from "novel";
import { Check, TextQuote, TrashIcon } from "lucide-react";

// Helper function to convert Markdown to HTML with proper formatting
const convertMarkdownToHtml = (markdown) => {
  let html = markdown
    // Convert headers to HTML
    .replace(/^#{6}\s+(.*$)/gim, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.*$)/gim, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.*$)/gim, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.*$)/gim, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.*$)/gim, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.*$)/gim, '<h1>$1</h1>')
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert bullet lists
    .replace(/^[\s]*[\*\-\+]\s+(.*$)/gim, '<li>$1</li>')
    // Convert numbered lists
    .replace(/^[\s]*\d+\.\s+(.*$)/gim, '<li>$1</li>')
    // Wrap consecutive list items in ul/ol
    .replace(/(<li>.*<\/li>)/gs, (match) => {
      // Check if it's a numbered list by looking at the original text
      const lines = markdown.split('\n');
      let isNumbered = false;
      for (let line of lines) {
        if (/^\s*\d+\.\s+/.test(line)) {
          isNumbered = true;
          break;
        }
      }
      return isNumbered ? `<ol>${match}</ol>` : `<ul>${match}</ul>`;
    })
    // Convert paragraphs (lines that don't start with HTML tags)
    .replace(/^(?!<[h1-6]|<li|<ul|<ol)(.+)$/gim, '<p>$1</p>')
    // Remove horizontal rules
    .replace(/^[\s]*[-=*_]{3,}[\s]*$/gim, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  return html;
};

const AICompletionCommands = ({
  completion,
  onDiscard,
}) => {
  const { editor } = useEditor();
  return (
    <>
      <CommandGroup>
        <CommandItem
          className="gap-2 px-4"
          value="replace"
          onSelect={() => {
            const selection = editor.view.state.selection;
            const htmlContent = convertMarkdownToHtml(completion);
            
            console.log('Original completion:', completion);
            console.log('Converted HTML:', htmlContent);

            editor
              .chain()
              .focus()
              .insertContentAt(
                {
                  from: selection.from,
                  to: selection.to,
                },
                htmlContent,
              )
              .run();
          }}
        >
          <Check className="h-4 w-4 text-muted-foreground" />
          Replace selection
        </CommandItem>
        <CommandItem
          className="gap-2 px-4"
          value="insert"
          onSelect={() => {
            const selection = editor.view.state.selection;
            const htmlContent = convertMarkdownToHtml(completion);
            
            console.log('Original completion (insert):', completion);
            console.log('Converted HTML (insert):', htmlContent);
            
            editor
              .chain()
              .focus()
              .insertContentAt(selection.to, htmlContent)
              .run();
          }}
        >
          <TextQuote className="h-4 w-4 text-muted-foreground" />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4">
          <TrashIcon className="h-4 w-4 text-muted-foreground" />
          Discard
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AICompletionCommands;
