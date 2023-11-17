export type PageLayoutProps = {
  children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return <main className="h-full flex justify-center items-center">{children}</main>;
}
