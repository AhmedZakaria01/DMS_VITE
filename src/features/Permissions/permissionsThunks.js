// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPermissions, getScreensPermissions } from "../../services/apiServices";

// Fetch User Repositories
export const fetchPermissions = createAsyncThunk(
  "permissions/fetchpermissions",
  async () => {
    const response = await getPermissions();
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

