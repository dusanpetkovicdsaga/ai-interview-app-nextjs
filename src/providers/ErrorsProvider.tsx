"use client";
import React from "react";
import useInterviewStore from "../store/useInterviewStore";

const ErrorsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const errors = useInterviewStore((store) => store.errors);
  const setErrors = useInterviewStore((store) => store.setErrors);

  const handleRemoveError = (index: number) => {
    setErrors(errors.filter((_, i) => i !== index));
  };

  return (
    <>
      {errors.length > 0 && (
        <div className="absolute w-50% right-5 max-sm:left-5 z-10 top-5">
          {errors.map((error, index) => (
            <div
              className="bg-red-500 text-white p-4 my-2 rounded animate-slideDown duration-500 ease-out pr-10"
              key={index}
            >
              {error.message}
            <button
                className="ml-2 outline-none border-none hover:border-none hover:outline-none bg-transparent text-white absolute right-0 top-1/2 transform -translate-y-1/2"
                onClick={() => handleRemoveError(index)}
            >
                X
            </button>
            </div>
          ))}
        </div>
      )}
      {children}
    </>
  );
};

export default ErrorsProvider;
