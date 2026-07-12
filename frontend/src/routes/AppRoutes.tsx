import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;