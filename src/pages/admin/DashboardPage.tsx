// src/pages/admin/DashboardPage.tsx
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // <-- Impor Link

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang, {user?.name || "Admin"}!
          </p>
        </div>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Manajemen Volunteer</h3>
          <p className="text-muted-foreground mb-4">
            Lihat, edit, dan kelola semua data volunteer.
          </p>
          <Button asChild>
            <Link to="/admin/volunteers">Buka Daftar Volunteer</Link>
          </Button>
        </div>
        {/* Placeholder untuk menu admin lainnya */}
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Manajemen Aktivitas</h3>
          <p className="text-muted-foreground">Segera Hadir</p>
        </div>
      </div>
    </div>
  );
}
