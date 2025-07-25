// src/router/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Kita akan tambahkan rute lain di sini nanti */}
    </Routes>
  );
};

export default AppRouter;
