// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAvailablePermission, getPermissions, getPrinciples, getScreensPermissions } from "../../services/apiServices";

// Fetch User Repositories
// export const fetchPermissions = createAsyncThunk(
//   "permissions/fetchpermissions",
//   async () => {
//     const response = await getPermissions();
//     return response.data;
//   }
// );

// Fetch User - Role 
export const fetchPrinciples = createAsyncThunk(
  "permissions/fetchPrinciples",
  async (id) => {
    const response = await getPrinciples(id);
    console.log(response);
    
    return response.data;
  }
);
// Fetch User Repositories
export const fetchAvailablePermission = createAsyncThunk(
  "permissions/fetchAvailablePermissions",
  async (type) => {
    const response = await getAvailablePermission(type);
    return response.data;
  }
);



// Fetch screen permissions
export const fetchScreensPermissions = createAsyncThunk(
  "permissions/fetchScreensPermissions",
  async () => {
    const response = await getScreensPermissions();
    return response.data;
  }
);

