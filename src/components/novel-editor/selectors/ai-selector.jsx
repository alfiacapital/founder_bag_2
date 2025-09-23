import React, { useState } from "react";
import { Command, CommandInput } from "./command";
import { useCompletion } from "ai/react";
import { ArrowUp } from "lucide-react";
import { useEditor } from "novel";
import Markdown from "react-markdown";
import { Button } from "./command";
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

  return (
    <Command className="w-[350px] bg-dark-bg2 border border-dark-stroke">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <div className="prose p-2 px-4 prose-sm max-h-[400px] overflow-y-auto !text-white">
            <Markdown>{completion}</Markdown>
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
          <div className="relative">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              autoFocus
              placeholder={hasCompletion ? "Tell AI what to do next" : "Ask AI to edit or generate..."}
            />
            {/* <Button
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-blue-500 hover:bg-purple-900"
              onClick={() => {
                if (completion)
                  return complete(completion, {
                    body: { option: "zap", command: inputValue },
                  }).then(() => setInputValue(""));

                const slice = editor.state.selection.content();
                const text = editor.storage.markdown.serializer.serialize(slice.content);

                complete(text, {
                  body: { option: "zap", command: inputValue },
                }).then(() => setInputValue(""));
              }}
            >
              <ArrowUp className="h-4 w-4" />
            </Button> */}
          </div>
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
