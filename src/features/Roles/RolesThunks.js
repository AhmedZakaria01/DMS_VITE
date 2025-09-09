import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewRole,
  getRoles,
  updateRole as updateRoleAPI,
} from "../../services/apiServices";

export const fetchRoles = createAsyncThunk("users/fetchRoles", async () => {
  const response = await getRoles();
  console.log(response.data.response);
  return response.data.response;
});

export const createRole = createAsyncThunk(
  "users/createRole",
  async (userData) => {
    const response = await createNewRole(userData);
    return response.data.response;
  }
);

export const updateRole = createAsyncThunk(
  "users/updateRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await updateRoleAPI(roleData);
      return response.data.response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role"
      );
    }
  }
);
