import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import React from "react";
import ProtectRoute from "./ProtectRoute";
import Login from "./Login";
import Register from "./Register";
import MainApp from "./MainApp";
function App() {
  const { currentUser, signin, logout } = useAuth();
  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectRoute>
              <MainApp />
            </ProtectRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
