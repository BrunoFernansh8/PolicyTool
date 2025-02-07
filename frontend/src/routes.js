import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SuperuserDashboard from "./pages/SuperuserDashboard";
import UserDashboard from "./pages/UserDashboard";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/superuser" element={<ProtectedRoute element={<SuperuserDashboard />} />} />
      <Route path="/user" element={<ProtectedRoute element={<UserDashboard />} />} />
    </Routes>
  );
};

export default AppRoutes;
