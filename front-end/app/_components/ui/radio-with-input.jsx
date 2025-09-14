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

const labelStyles = cva("flex flex-col md:flex-row gap-3 cursor-pointer items-start md:items-center", {
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

export default function RadioGroupWithInput({
  options,
  name,
  value,
  onChange,
  size,
  color,
  disabled,
}) {
  const selectedValue = typeof value === "object" ? value.radio : "";

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const isChecked = selectedValue === option.value;

        return (
          <label key={option.value} className={labelStyles({ disabled })}>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => {
                  const next = isChecked ? "" : option.value;
                  onChange?.(option.showInputWhen
                    ? { radio: next, input: "" }
                    : next
                  );
                }}
                disabled={disabled}
                className={radioStyles({ size, color, disabled })}
              />
              <span className="text-base md:text-xl">{option.label}</span>
            </div>

            {option.showInputWhen && isChecked && (
              <input
                type="text"
                className={inputStyles()}
                value={value?.input || ""}
                placeholder={option.inputPlaceholder || "請輸入..."}
                onChange={(e) => {
                  onChange?.({ radio: option.value, input: e.target.value });
                }}
                disabled={disabled}
              />
            )}
          </label>
        );
      })}
    </div>
  );
}