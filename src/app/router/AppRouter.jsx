import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "../../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Dashboard from "../../pages/Dashboard";
import Students from "../../pages/Students";
import Schedule from "../../pages/Schedule";
import Grades from "../../pages/Grades";
import Notifications from "../../pages/Notifications";
import SeedData from "../../pages/SeedData";

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <p>Загрузка...</p>;
  return user ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <p>Загрузка...</p>;
  return !user ? children : <Navigate to="/dashboard" />;
}


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
        <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
        <Route path="/grades" element={<PrivateRoute><Grades /></PrivateRoute>} />
        <Route path="/seed" element={<PrivateRoute><SeedData /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}