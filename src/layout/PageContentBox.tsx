export function PageContentBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex w-90% lg:max-h-[35rem] bg-white rounded-md flex-col justify-center px-6 py-12 g:px-8 animate-slideDown duration-500 ease-out ${className}`}>{children}</div>;
}
