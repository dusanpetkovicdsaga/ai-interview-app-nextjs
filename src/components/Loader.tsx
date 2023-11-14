import React from "react";

interface LoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const Loader: React.FC<LoaderProps> = ({ isLoading, children }) => {
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Loader;
