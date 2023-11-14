import { ChangeEventHandler } from "react";

type Props = {
  id: string;
  required?: boolean;
  label: string;
  placeholder?: string;
  type: "email" | "text" | "textarea";
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value?: string;
};

function InputField({ label, id, type, required = true, onChange, placeholder = 'Enter value', value }: Props) {
  const inputProps = {
    id: id,
    name: id,
    placeholder: placeholder,
    type,
    autoComplete: type === "email" ? "email" : undefined,
    required,
    className:
      "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
    onChange,
    value,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputProps.id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      </div>
      <div className="mt-2">
        {type === "textarea" ? (
          <textarea {...inputProps} value={value} />
        ) : (
          <input {...inputProps} value={value} />
        )}
      </div>
    </div>
  );
}

export default InputField;
