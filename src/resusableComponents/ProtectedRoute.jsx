/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../services/apiServices";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // If the token is present, render the children
  return isAuthenticated() ? children : null;
}

export default ProtectedRoute;
