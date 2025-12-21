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
import AdminRoute from "./resusableComponents/ProtectedRoute";
import CreateFolder from "./features/FolderContent/components/CreateFolder";
import { Search, Settings } from "lucide-react";
import Category from "./features/Category/FileCategory/Category";
import DocTypeForm from "./features/DocumentType/DocTypeForm";
import DocumentTypes from "./features/DocumentType/DocumentTypes";
import UpdateDocType from "./features/DocumentType/UpdateDocType";
import FileCategoryForm from "./features/Category/FileCategory/FileCategoryForm";
// import CategoryTable from "./features/Category/FileCategory/CategoryTable";
import CreateCategory from "./features/Category/FileCategory/CreateCategory";
import CreateDocument from "./features/Document/component/CreateDocument";
import UserSearchForm from "./features/Search/UserSearchForm";
import Annotations from "./Annotations/Annotations";
// import ScreenPermissions from "./features/Permissions/screenPermissions";
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
          {/* <Route path="/category" element={<CreateCategory />} /> */}
          <Route path="/category" element={<Category />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/Annotations" element={<Annotations />} />
          <Route path="/documentTypes/:repoId" element={<DocumentTypes />} />
          <Route path="/updateDocType/:docTypeId" element={<UpdateDocType />} />
          <Route path="/createDocumentType/:repoId" element={<DocTypeForm />} />
          <Route path="/FileCategoryForm" element={<FileCategoryForm />} />
          {/* <Route path="/documentCategoryTable" element={<CreateDocument />} /> */}
          <Route path="/search" element={<UserSearchForm />} />

          <Route path="/CreateCategory" element={<CreateCategory />} />

          <Route
            path="/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <AdminRoute>
                <Roles />
              </AdminRoute>
            }
          />
          <Route path="/permissions" element={<Permissions />} />
          {/* <Route path="/ScreenPermissions" element={<ScreenPermissions />} /> */}

          <Route path="/roles" element={<Roles />} />
          <Route path="/repoContents/:repoId" element={<RepoContents />} />
          <Route path="/documentViewer" element={<DocumentViewer />} />
          <Route
            path="/usersRolesPermissionsTable"
            element={<UsersRolesPermissionsTable />}
          />
          <Route
            path="/repoContents/:repoId/folderContent/:folderId"
            element={<FolderContents />}
          />

          <Route path="/createRepo" element={<RepoForm />} />
          <Route
            path="/repos/:repoId/update-details"
            element={<UpdateRepo />}
          />
          {/* <Route path="/repos/:repoId/update-Permissions" element={<UpdatePermissions />} /> */}
          {/* <Route path="/createFolder" element={<CreateFolder />} /> */}
          <Route
            path="/repoContents/:repoId/createFolder"
            element={<CreateFolder />}
          />
          <Route
            path="/repoContents/:repoId/createDocument"
            element={<CreateDocument />}
          />
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
