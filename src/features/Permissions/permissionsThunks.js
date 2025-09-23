// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPermissions } from "../../services/apiServices";

// Fetch User Repositories
export const fetchPermissions = createAsyncThunk(
  "permissions/fetchpermissions",
  async () => {
    const response = await getPermissions();
    return response.data;
  }
);
