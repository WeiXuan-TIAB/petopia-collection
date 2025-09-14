import { useState } from "react";
import { cva } from "class-variance-authority";

const radioStyles = cva(
  "appearance-none rounded-full border-2 transition-all duration-200",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-[18px] h-[18px]",
        lg: "w-6 h-6",
      },
      color: {
        primary: "bg-gray-200 checked:bg-primary border-4 border-gray-200",
        secondary: "border-gray-400 checked:bg-secondary checked:border-secondary",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
      disabled: false,
    },
  }
);

const labelStyles = cva("flex flex-col md:flex-row h-auto md:h-[36px] items-start md:items-center justify-start gap-4 cursor-pointer", {
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const inputStyles = cva(
  "ml-3 border-2 rounded-full px-4 py-1 text-md focus:outline-none border-primary transition-all duration-200"
);

export default function RadioGroup({
  options,
  name,
  size,
  color,
  disabled,
  onChange,
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const [extraValue, setExtraValue] = useState("");

  const handleChange = (value, showInput) => {
    setSelectedValue(value);
    if (!showInput) {
      onChange?.(value);
    } else {
      onChange?.(extraValue);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const showExtraInput = option.showInputWhen && selectedValue === option.value;

        return (
          <label key={option.value} className={labelStyles({ disabled })}>
            <div className="flex justify-start items-center gap-2">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleChange(option.value, option.showInputWhen)}
                disabled={disabled}
                className={radioStyles({ size, color, disabled })}
              />
              <span className="text-base md:text-xl">{option.label}</span>
            </div>


            {/* input */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${showExtraInput ? "block opacity-100 max-w-xs ml-3" : "hidden opacity-0 max-w-0 ml-0"
                }`}
            >
              {option.showInputWhen && (
                <input
                  type="text"
                  placeholder={option.inputPlaceholder || "請輸入..."}
                  value={extraValue}
                  onChange={(e) => {
                    setExtraValue(e.target.value);
                    onChange?.(e.target.value);
                  }}
                  className={inputStyles()}
                  disabled={disabled}
                />
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
