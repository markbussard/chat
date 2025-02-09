type ProtectedLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function ProtectedLayout(props: ProtectedLayoutProps) {
  return (
    <main className="relative h-full w-full flex-1 bg-background">
      {props.children}
    </main>
  );
}
