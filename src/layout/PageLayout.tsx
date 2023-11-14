export type PageLayoutProps = {
  children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return <main className="h-full bg-white rounded-md">{children}</main>;
}
