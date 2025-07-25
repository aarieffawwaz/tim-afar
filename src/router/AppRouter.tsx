// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Import Komponen
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import VolunteerRegistrationPage from "@/pages/volunteer/VolunteerRegistrationPage";
import VolunteersListPage from '@/pages/admin/VolunteersListPage';

/**
 * Komponen HomePage berfungsi sebagai "pintu gerbang" setelah login.
 * Ia akan memeriksa role dan kelengkapan profil untuk mengarahkan pengguna.
 */
function HomePage() {
  const { user } = useAuth();

  // TODO: Logika ini perlu disempurnakan.
  // Kita perlu cara untuk tahu dari `user` object apakah profilnya sudah lengkap.
  // Untuk sekarang, kita asumsikan semua volunteer baru profilnya belum lengkap.
  const isProfileConsideredComplete = false;

  // Jika pengguna adalah admin, langsung arahkan ke dashboard admin.
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Jika pengguna adalah volunteer dan profilnya belum lengkap, arahkan ke form.
  if (user?.role === "volunteer" && !isProfileConsideredComplete) {
    return <Navigate to="/volunteer/register-profile" replace />;
  }

  // Jika volunteer tapi profil sudah lengkap (kondisi ideal nanti)
  // atau ada kondisi lain, tampilkan halaman sambutan sederhana.
  return (
    <div className="p-8">
      <h1 className="text-2xl">Selamat Datang, {user?.name}!</h1>
      <p>Anda telah berhasil login.</p>
    </div>
  );
}

// --- Konfigurasi Router Utama ---
const AppRouter = () => {
  return (
    <Routes>
      {/* Rute Publik (Bisa diakses siapa saja) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rute yang Dilindungi */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer/register-profile"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <VolunteerRegistrationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "volunteer"]}>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Rute Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/volunteers" // <-- Rute baru
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <VolunteersListPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
