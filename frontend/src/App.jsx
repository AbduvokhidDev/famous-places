import { useAuth } from "@clerk/react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import FamousPlaces from "./pages/FamousPlaces";
import Home from "./pages/Home";
import Myplaces from "./pages/Myplaces";
import Profile from "./pages/Profile";

function App() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/famousplaces" element={<FamousPlaces />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myplaces"
          element={
            <ProtectedRoute>
              <Myplaces />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
