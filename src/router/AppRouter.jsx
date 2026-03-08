import { Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import AdminPanel from "../pages/panelAdmin";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/Page404";
const AppRouter = () => {
  const { user, hasRole } = useAppStore();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route 
        path="/dashboard" 
        element={user === null ? <Navigate to="/" /> : <Dashboard />} 
      />
      <Route 
        path="/dashboard/movie/:id" 
        element={user === null ? <Navigate to="/" /> : <Dashboard />} 
      />
      <Route 
        path="/profile" 
        element={user === null ? <Navigate to="/" /> : <Profile />} 
      />
      <Route 
        path="/profile/movie/:id" 
        element={user === null ? <Navigate to="/" /> : <Profile />} 
      />
      <Route 
        path="/admin" 
        element={
          user === null ? <Navigate to="/" /> :
          hasRole(["admin"]) ? <AdminPanel /> : <Unauthorized />
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default AppRouter;
