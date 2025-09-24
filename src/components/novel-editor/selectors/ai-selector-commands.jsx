import React from "react";
import { ArrowDownWideNarrow, CheckCheck, RefreshCcwDot, StepForward, WrapText, Type, List, Hash } from "lucide-react";
import { useEditor } from "novel";
import { CommandGroup, CommandItem, CommandSeparator } from "./command";

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },
  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
];

const AISelectorCommands = ({ onSelect }) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Edit or review selection">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const { from, to } = editor.state.selection;
              const text = editor.state.doc.textBetween(from, to);
              onSelect(text, value);
            }}
            className="flex gap-2 px-4 text-dark-text2 hover:text-white "
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-blue-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Quick Formatting">
        <CommandItem
          onSelect={() => {
            const { from, to } = editor.state.selection;
            const text = editor.state.doc.textBetween(from, to);
            onSelect(text, "bold");
          }}
          value="bold"
          className="gap-2 px-4 text-dark-text2 hover:text-white"
        >
          <Type className="h-4 w-4 text-blue-500" />
          **Bold** text
        </CommandItem>
        <CommandItem
          onSelect={() => {
            const { from, to } = editor.state.selection;
            const text = editor.state.doc.textBetween(from, to);
            onSelect(text, "heading");
          }}
          value="heading"
          className="gap-2 px-4 text-dark-text2 hover:text-white"
        >
          <Hash className="h-4 w-4 text-blue-500" />
          ### Heading
        </CommandItem>
        <CommandItem
          onSelect={() => {
            const { from, to } = editor.state.selection;
            const text = editor.state.doc.textBetween(from, to);
            onSelect(text, "list");
          }}
          value="list"
          className="gap-2 px-4 text-dark-text2 hover:text-white"
        >
          <List className="h-4 w-4 text-blue-500" />
          * Bullet point
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use AI to do more">
        <CommandItem
          onSelect={() => {
            const pos = editor.state.selection.from;
            // Simple implementation of getPrevText
            const text = editor.state.doc.textBetween(Math.max(0, pos - 100), pos);
            onSelect(text, "continue");
          }}
          value="continue"
          className="gap-2 px-4 text-dark-text2 hover:text-white"
        >
          <StepForward className="h-4 w-4 text-blue-500" />
          Continue writing
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;
