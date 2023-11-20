// create a button primary component

import React, { ButtonHTMLAttributes } from 'react';

export type ButtonPrimaryProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  type?: "submit" | "reset" | "button" | undefined;
  children: React.ReactNode;
};

export function ButtonPrimary({ children, type = "submit", disabled, className = '', ...rest }: ButtonPrimaryProps) {
  return (
    <button
      type={type}
      className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${disabled ? 'bg-gray-300' : 'bg-blue-600'} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
