import React from "react";

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  options: string[] | { key: string; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  options,
  placeholder = "Enter value",
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-left text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <select
          id={id}
          name={name}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-5"
          onChange={onChange}
        >
          <option value="" disabled selected>
            {placeholder}
          </option>
          {options.map((option) => (
            <>
              {typeof option === "object" && "key" in option ? (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ) : (
                <option key={option} value={option}>
                  {option}
                </option>
              )}
            </>
          ))}
        </select>
      </div>
    </div>
  );
};
