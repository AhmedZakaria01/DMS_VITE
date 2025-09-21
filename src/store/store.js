import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import repoReducer from "../features/Repos/repoSlice";
import usersReducer from "../features/Users/usersSlice";
import rolesReducer from "../features/Roles/RolesSlice";
import auditReducer from "../features/Audit/auditSlice";
import repoContentReducer from "../features/RepoContents/repoContentSlice";
import folderContentsReducer from "../features/FolderContent/folderContentsSlice";
import categoryReducer from '../features/Category/categorySlice'
export const store = configureStore({
  reducer: {
    // Auth
    authReducer,
    repoReducer,
    usersReducer,
    rolesReducer,
    auditReducer,
    repoContentReducer,
    folderContentsReducer,
    categoryReducer
  },
});
