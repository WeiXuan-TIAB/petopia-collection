"use client";

import { useRef } from "react";
import { cva } from "class-variance-authority";
import { FaPhone } from "react-icons/fa6";
import { FiX } from "react-icons/fi";

const inputVariants = cva(
  "border rounded-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 border-red-400",
  {
    variants: {
      width: {
        fixed: "w-64",
        full: "w-full",
      },
      hasIcon: {
        yes: "pl-12",
        no: "pl-5",
      },
    },
    defaultVariants: {
      width: "full",
      hasIcon: "no",
    },
  }
);

export default function Input({
  placeholder = "請輸入文字...",
  width,
  showIcon = false,
  iconComponent: IconComponent,
  type = "text",
  value = "", 
  onChange = () => {},
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const hasValue = value !== "";

  return (
    <div className="relative w-full">
      {/* icon */}
      {showIcon && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          {IconComponent ? <IconComponent size={18} /> : <FaPhone size={18} />}
        </span>
      )}

      {/* input */}
      <input
        ref={inputRef}
        type={type}
        className={`${inputVariants({ width, hasIcon: showIcon ? "yes" : "no" })} pr-10`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* clear */}
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}
