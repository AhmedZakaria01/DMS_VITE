// // import { createAsyncThunk } from "@reduxjs/toolkit";
// // import {
// //   createNewRole,
// //   getPermissionRole,
// //   getRoles,
// //   updateSpaecificRole,
// // } from "../../services/apiServices";

// // // Get all Roles
// // export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
// //   const response = await getRoles();
// //   // console.log(response.data.response);
// //   return response.data.response;
// // });

// // // Create New Role
// // export const createRole = createAsyncThunk(
// //   "roles/createRole",
// //   async (roleData, { rejectWithValue }) => {
// //     try {
// //       const response = await createNewRole(roleData);
      
// //       // Check if response exists and has data
// //       if (!response || !response.data) {
// //         throw new Error("No response received from server");
// //       }
      
// //       // Return the nested response data based on your API structure
// //       return response.data.response || response.data;
// //     } catch (error) {
// //       console.error("Create role thunk error:", error);
// //       return rejectWithValue(
// //         error.response?.data?.message || 
// //         error.message || 
// //         "Failed to create role"
// //       );
// //     }
// //   }
// // );

// // // Update Existing Role
// // export const updateRole = createAsyncThunk(
// //   "roles/updateRole",
// //   async (roleData, { rejectWithValue }) => {
// //     try {
// //       if (!roleData.roleId) {
// //         throw new Error("Role ID is required for updating");
// //       }
      
// //       const response = await updateSpaecificRole(roleData);
// //       return response.data.response || response.data;
// //     } catch (error) {
// //       console.error("Update role thunk error:", error);
// //       return rejectWithValue(
// //         error.response?.data?.message || 
// //         error.message || 
// //         "Failed to update role"
// //       );
// //     }
// //   }
// // );

// // // Fetch Permissions for Specific Role
// // export const fetchPermssionforpecificrole = createAsyncThunk(
// //   "roles/fetchPermssionforpecificrole",
// //   async (roleId, { rejectWithValue }) => {
// //     try {
// //       if (!roleId) {
// //         throw new Error("Role ID is required");
// //       }
      
// //       const response = await getPermissionRole(roleId);
// //       return response.data.response;
// //     } catch (error) {
// //       console.error("Fetch permissions for role thunk error:", error);
// //       return rejectWithValue(
// //         error.response?.data?.message || 
// //         error.message || 
// //         "Failed to fetch role permissions"
// //       );
// //     }
// //   }
// // );
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   createNewRole,
//   getPermissionRole,
//   getRoles,
//   updateSpaecificRole,
// } from "../../services/apiServices";

// // Get all Roles
// export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
//   const response = await getRoles();
//   // console.log(response.data.response);
//   return response.data.response;
// });

// // Create New Role
// export const createRole = createAsyncThunk(
//   "roles/createRole",
//   async (roleData, { rejectWithValue }) => {
//     try {
//       const response = await createNewRole(roleData);
      
//       // Check if response exists and has data
//       if (!response || !response.data) {
//         throw new Error("No response received from server");
//       }
      
//       // Return the nested response data based on your API structure
//       return response.data.response || response.data;
//     } catch (error) {
//       console.error("Create role thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message || 
//         error.message || 
//         "Failed to create role"
//       );
//     }
//   }
// );

// // Update Existing Role - UPDATED
// export const updateRole = createAsyncThunk(
//   "roles/updateRole",
//   async (roleData, { rejectWithValue }) => {
//     try {
//       if (!roleData.roleId) {
//         throw new Error("Role ID is required for updating");
//       }
      
//       // Ensure roleName is included in the update
//       if (!roleData.roleName) {
//         console.warn("roleName not provided, using placeholder");
//         roleData.roleName ; 
//       }
      
//       const response = await updateSpaecificRole(roleData);
//       return response.data.response || response.data;
//     } catch (error) {
//       console.error("Update role thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message || 
//         error.message || 
//         "Failed to update role"
//       );
//     }
//   }
// );

// // Fetch Permissions for Specific Role
// export const fetchPermssionforpecificrole = createAsyncThunk(
//   "roles/fetchPermssionforpecificrole",
//   async (roleId, { rejectWithValue }) => {
//     try {
//       if (!roleId) {
//         throw new Error("Role ID is required");
//       }
      
//       const response = await getPermissionRole(roleId);
//       return response.data.response;
//     } catch (error) {
//       console.error("Fetch permissions for role thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message || 
//         error.message || 
//         "Failed to fetch role permissions"
//       );
//     }
//   }
// );
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewRole,
  getPermissionRole,
  getRoles,
  updateSpaecificRole,
} from "../../services/apiServices";

// Get all Roles
export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const response = await getRoles();
  // console.log(response.data.response);
  return response.data.response;
});

// Create New Role
export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await createNewRole(roleData);
      
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

// Update Existing Role - UPDATED
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (roleData, { rejectWithValue }) => {
    try {
      if (!roleData.roleId) {
        throw new Error("Role ID is required for updating");
      }
      
      // Ensure roleName is included in the update
      if (!roleData.roleName) {
        console.warn("roleName not provided, using placeholder");
        roleData.roleName = "new"; // Fixed: Added assignment
      }
      
      const response = await updateSpaecificRole(roleData);
      return response.data.response || response.data;
    } catch (error) {
      console.error("Update role thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to update role"
      );
    }
  }
);

// Fetch Permissions for Specific Role
export const fetchPermssionforpecificrole = createAsyncThunk(
  "roles/fetchPermssionforpecificrole",
  async (roleId, { rejectWithValue }) => {
    try {
      if (!roleId) {
        throw new Error("Role ID is required");
      }
      
      const response = await getPermissionRole(roleId);
      return response.data.response;
    } catch (error) {
      console.error("Fetch permissions for role thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to fetch role permissions"
      );
    }
  }
);