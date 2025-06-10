import { Sidebar } from "@/components/sidebar";

export default function UpdateOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sm:ml-17 min-h-screen bg-sky-100">
      <Sidebar />
      {children}
    </div>
  );
}
