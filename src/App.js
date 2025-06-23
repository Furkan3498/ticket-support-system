import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import Login from "./auth/Login";
import Register from "./auth/Register";
import UserPanel from "./pages/user/UserPanel";
import AdminPanel from "./pages/admin/AdminPanel";
import Unauthorized from "./pages/Unauthorized";

import RoleBasedRoute from "./routes/RoleBasedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/panel"
            element={
              <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
                <UserPanel />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </RoleBasedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
