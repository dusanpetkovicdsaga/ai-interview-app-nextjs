import { ReactNode } from "react";

type Props = {
  name: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
};

function Checkmark({  name, id, checked, onChange, children }: Props) {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 mr-2 text-indigo-600"
        name={name}
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2 text-left text-gray-700">{children}</span>
    </label>
  );
}

export default Checkmark;
