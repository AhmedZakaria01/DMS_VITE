import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./features/auth/PageNotFound";
import Layout from "./Layout";
import Login from "./features/auth/components/Login";
import "./i18n";
import ProtectedRoute from "./resusableComponents/ProtectedRoute";
import Repositories from "./features/Repos/components/Repos";
import { useEffect } from "react";
import { isAuthenticated } from "./services/apiServices";
import { saveUserData } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated()) return;
    dispatch(saveUserData());
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes -  Outlet */}
          <Route path="repos" element={<Repositories />} />
        </Route>

        {/* Routes without Layout  */}
        <Route path="/login" element={<Login />} />

        {/* Page Not Found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
