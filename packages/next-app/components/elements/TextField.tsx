// import { InputHTMLAttributes } from "react";

export type TextFieldProps = {
  name?: string;
  label?: string;
  value?: string | number;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

export const TextField = ({
  name,
  label,
  value,
  type = "text",
  required,
  autoComplete = "off",
  placeholder,
  className,
  onChange,
}: TextFieldProps) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className={"block text-sm font-medium text-gray-100"}
      >
        {label}
      </label>
      <div className={"mt-1"}>
        <input
          id={name}
          name={name}
          value={value}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e);
          }}
          className={
            "block w-full rounded-md text-gray-700 border border-yellow-300 shadow-sm text-base py-2 px-3 focus:outline-transparent focus:border-yellow-300 focus:ring focus:ring-yellow-400 focus:ring-opacity-700"
          }
        />
      </div>
    </div>
  );
};
