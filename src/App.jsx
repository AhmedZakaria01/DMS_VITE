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
import Audit from "./features/Audit/components/Audit";
import Users from "./features/Users/components/Users";
import RepoForm from "./features/Repos/components/RepoForm";
import Roles from "./features/Roles/components/Roles";
 import FolderContents from "./features/FolderContent/components/FolderContents";
import DocumentViewer from "./features/Document/component/DocumentViewer";
import RepoContents from "./features/RepoContents/components/RepoContents";
import Permissions from "./features/Permissions/Permissions";
import UsersRolesPermissionsTable from "./features/Permissions/UsersRolesPermissionsTable";
import UpdateRepo from "./features/Repos/components/UpdateRepo";
// import UpdatePermissions from "./features/Permissions/UpdatePermissions";

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
          <Route index="true" element={<Repositories />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/users" element={<Users />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/repoContents/:repoId" element={<RepoContents />} />
          <Route path="/documentViewer" element={<DocumentViewer />} />
          <Route
            path="/usersRolesPermissionsTable"
            element={<UsersRolesPermissionsTable />}
          />
          <Route
            path="/repoContents/:repoId/folderContent/*"
            element={<FolderContents />}
          />
          <Route path="/createRepo" element={<RepoForm />} />
          <Route path="/repos/:repoId/update-details" element={<UpdateRepo />} />
          {/* <Route path="/repos/:repoId/update-Permissions" element={<UpdatePermissions />} /> */}

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
