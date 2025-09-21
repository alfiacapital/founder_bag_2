import React, { forwardRef } from 'react';

export const CustomTimeInput = React.forwardRef(({ value, onClick }, ref) => (
    <span
        ref={ref}
        onClick={onClick}
        className="text-dark-text2 cursor-pointer text-xs"
    >
        {value || "hh:mm"}
    </span>
));
CustomTimeInput.displayName = "CustomTimeInput";

export const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <span
        ref={ref}
        onClick={onClick}
        className="text-dark-text2 cursor-pointer text-xs"
    >
        {value || "mm/dd/yyyy"}
    </span>
));
CustomDateInput.displayName = "CustomDateInput";
