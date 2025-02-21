import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectRoute({ children }) {
  const { currentUser, signin, logout } = useAuth();
  const navigate = useNavigate();

  //if user is not logged in, redirect to login page
  //if user is logged in, render the component
  //if user is logged in, but does not have access to the component, redirect to home page

  if (!currentUser) {
    navigate("/login");
    return <></>;
  }
  return children;
}
