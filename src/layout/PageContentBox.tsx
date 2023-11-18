export function PageContentBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex w-90% bg-white rounded-md flex-col justify-center px-6 py-12 lg:px-8 animate-slideDown duration-500 ease-out ${className}`}>{children}</div>;
}
