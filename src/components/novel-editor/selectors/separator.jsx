import React from "react";

export const Separator = ({ orientation = "horizontal", className = "" }) => {
  const baseClasses = "shrink-0 bg-border";
  const orientationClasses = {
    horizontal: "h-[1px] w-full",
    vertical: "h-full w-[1px]",
  };
  
  return (
    <div
      className={`${baseClasses} ${orientationClasses[orientation]} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};
