import React, { useState } from "react";
import { Command, CommandInput } from "./command";
import { useCompletion } from "ai/react";
import { useEditor } from "novel";
import Markdown from "react-markdown";
import CrazySpinner from "./crazy-spinner";
import { Magic } from "./command";
import AICompletionCommands from "./ai-completion-command";
import AISelectorCommands from "./ai-selector-commands";

const AISelector = ({ onOpenChange }) => {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");

  const { completion, complete, isLoading } = useCompletion({
    api: `${import.meta.env.VITE_API_URL}/api/groq/generate`,
    onError: (e) => {
      console.error("AI Error:", e.message);
    },
  });

  const hasCompletion = completion.length > 0;

  // Function to handle submit
  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    if (completion) {
      complete(completion, {
        body: { option: "zap", command: inputValue },
      }).then(() => setInputValue(""));
    } else {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);

      complete(text, {
        body: { option: "zap", command: inputValue },
      }).then(() => setInputValue(""));
    }
  };

  // Function to handle key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Command className="w-[350px] bg-dark-bg2 border border-dark-stroke">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <div className="p-2 px-4 max-h-[400px] overflow-y-auto text-white">
            <div className="ai-response-content">
              <Markdown>{completion}</Markdown>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-blue-500">
          <Magic className="mr-2 h-4 w-4 shrink-0" />
          AI is thinking
          <div className="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder={hasCompletion ? "Tell AI what to do next" : "Ask AI to edit or generate..."}
          />
          {hasCompletion ? (
            <AICompletionCommands
              onDiscard={() => {
                editor.chain().unsetHighlight().focus().run();
                onOpenChange(false);
              }}
              completion={completion}
            />
          ) : (
            <AISelectorCommands onSelect={(value, option) => complete(value, { body: { option } })} />
          )}
        </>
      )}
    </Command>
  );
};

export default AISelector;
