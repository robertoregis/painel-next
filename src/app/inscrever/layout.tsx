
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center items-center bg-neutral-400">
    <div className="w-full mx-auto flex h-screen shadow-lg justify-center items-center">
      {children}
      </div>
    </div>
  );
}
