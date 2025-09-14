import { cva } from "class-variance-authority";

// style
const checkboxStyles = cva(
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

const labelStyles = cva("flex items-center gap-3 cursor-pointer", {
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export default function CheckboxRadio({
  options,
  name,
  value,
  onChange,
  size,
  color,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const isChecked = value === option.value;

        return (
          <label key={option.value} className={labelStyles({ disabled })}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => {
                const next = isChecked ? "" : option.value;
                onChange?.(next);
              }}
              disabled={disabled}
              className={checkboxStyles({ size, color, disabled })}
            />
            <span className="text-base md:text-xl">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
