import React, { useEffect, useState } from 'react';

export type PageHeadlineProps = {
  children: React.ReactNode;
  animate?: boolean;
};

export function PageHeadline({ children, animate = false }: PageHeadlineProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (animate) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [animate]);

  return (
    <h2
      className={`mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 ${show ? 'slide-down' : ''}`}
    >
      {children}
    </h2>
  );
}