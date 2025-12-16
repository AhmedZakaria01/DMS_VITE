// import { createSlice } from "@reduxjs/toolkit";
// import { 
//   createRole, 
//   fetchRoles, 
//   updateRole, 
//   fetchPermssionforpecificrole 
// } from "./RolesThunks";

// const rolesSlice = createSlice({
//   name: "roles",
//   initialState: {
//     roles: [],
//     permissionRoles: [],
//     status: "idle",
//     error: null,
//     lastFetched: null,
//   },
//   reducers: {
//     clearRoleError: (state) => {
//       state.error = null;
//     },
//     resetRoleStatus: (state) => {
//       state.status = "idle";
//       state.error = null;
//     },
//     // Add this new reducer to manually set permission roles
//     setPermissionRoles: (state, action) => {
//       state.permissionRoles = action.payload;
//     },
//     // Clear permission roles when needed
//     clearPermissionRoles: (state) => {
//       state.permissionRoles = [];
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Roles
//       .addCase(fetchRoles.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchRoles.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.roles = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchRoles.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
      
//       // Create Role
//       .addCase(createRole.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(createRole.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.roles.push(action.payload);
//         state.error = null;
//       })
//       .addCase(createRole.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
      
//       // Update Role
//       .addCase(updateRole.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(updateRole.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const index = state.roles.findIndex(role => role.roleId === action.payload.roleId);
//         if (index !== -1) {
//           state.roles[index] = action.payload;
//         }
//         state.error = null;
//       })
//       .addCase(updateRole.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
      
//       // Fetch Permissions for Specific Role
//       .addCase(fetchPermssionforpecificrole.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchPermssionforpecificrole.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.permissionRoles = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchPermssionforpecificrole.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const { 
//   clearRoleError, 
//   resetRoleStatus, 
//   setPermissionRoles, 
//   clearPermissionRoles 
// } = rolesSlice.actions;
// export default rolesSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { 
  createRole, 
  fetchRoles, 
  updateRole, 
  fetchPermssionforpecificrole 
} from "./RolesThunks";

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    permissionRoles: [],
    status: "idle",
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    resetRoleStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    // Add this new reducer to manually set permission roles
    setPermissionRoles: (state, action) => {
      state.permissionRoles = action.payload;
    },
    // Clear permission roles when needed
    clearPermissionRoles: (state) => {
      state.permissionRoles = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create Role
      .addCase(createRole.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles.push(action.payload);
        state.error = null;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Update Role - FIXED
      .addCase(updateRole.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.roles.findIndex(role => role.roleId === action.payload.roleId);
        if (index !== -1) {
          // Update the role with new data
          state.roles[index] = {
            ...state.roles[index],
            ...action.payload
          };
        } else {
          // If role not found in list, add it
          state.roles.push(action.payload);
        }
        state.error = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Fetch Permissions for Specific Role
      .addCase(fetchPermssionforpecificrole.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPermssionforpecificrole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.permissionRoles = action.payload;
        state.error = null;
      })
      .addCase(fetchPermssionforpecificrole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { 
  clearRoleError, 
  resetRoleStatus, 
  setPermissionRoles, 
  clearPermissionRoles 
} = rolesSlice.actions;
export default rolesSlice.reducer;
