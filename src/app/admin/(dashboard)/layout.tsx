import { AdminDataProvider } from "@/components/admin/AdminDataProvider";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminDataProvider>{children}</AdminDataProvider>;
}
