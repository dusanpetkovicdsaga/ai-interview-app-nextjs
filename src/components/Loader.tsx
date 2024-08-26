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
          <div className="loader"></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Loader;
