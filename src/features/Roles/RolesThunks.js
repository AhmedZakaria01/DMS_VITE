import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewRole,
  getRoles,
  updateRole as updateRoleAPI,
} from "../../services/apiServices";
// Get all Roles
export const fetchRoles = createAsyncThunk("users/fetchRoles", async () => {
  const response = await getRoles();
  console.log(response.data.response);
  return response.data.response;
});
// Create New Roles
export const createRole = createAsyncThunk(
  "users/createRole",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createNewRole(userData);
      
      // Check if response exists and has data
      if (!response || !response.data) {
        throw new Error("No response received from server");
      }
      
      // Return the nested response data based on your API structure
      return response.data.response || response.data;
    } catch (error) {
      console.error("Create role thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to create role"
      );
    }
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
