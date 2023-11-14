export type PageHeadlineProps = {
  children: React.ReactNode;
};

export function PageHeadline({ children }: PageHeadlineProps) {
  return (
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
      {children}
    </h2>
  );
}
