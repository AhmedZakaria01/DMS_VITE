// import { createSlice } from "@reduxjs/toolkit";
// import {  fetchAvailablePermission, fetchScreensPermissions } from "./permissionsThunks";

// const permissionSlice = createSlice({
//   name: "permissions",
//   initialState: {
//     permissions: [],
//     status: "idle",
//     error: null,
//     screenPermissions: [],
//     screenStatus: "idle",
//     screenError: null,
//   },
//   reducers: {
//     clearPermissions: (state) => {
//       state.permissions = [];
//       state.screenPermissions = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch User Permissions
//       .addCase(fetchAvailablePermission.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchAvailablePermission.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.permissions = action.payload?.response || [];
//       })
//       .addCase(fetchAvailablePermission.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })

//       // Fetch Screen Permissions
//       .addCase(fetchScreensPermissions.pending, (state) => {
//         state.screenStatus = "loading";
//       })
//       .addCase(fetchScreensPermissions.fulfilled, (state, action) => {
//         state.screenStatus = "succeeded";
//         state.screenPermissions = action.payload?.response || [];
//       })
//       .addCase(fetchScreensPermissions.rejected, (state, action) => {
//         state.screenStatus = "failed";
//         state.screenError = action.error.message;
//       });
//   },
// });

// export const { clearPermissions } = permissionSlice.actions;
// export default permissionSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAvailablePermission,
  fetchScreensPermissions,
  fetchPrinciples,
} from "./permissionsThunks";

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: [],
    status: "idle",
    error: null,
    screenPermissions: [],
    screenStatus: "idle",
    screenError: null,
    // Add principles state
    principles: [],
    principlesStatus: "idle",
    principlesError: null,
  },
  reducers: {
    clearPermissions: (state) => {
      state.permissions = [];
      state.screenPermissions = [];
      state.principles = []; // Clear principles too
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Permissions
      .addCase(fetchAvailablePermission.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAvailablePermission.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.permissions = action.payload?.response || [];
      })
      .addCase(fetchAvailablePermission.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Screen Permissions
      .addCase(fetchScreensPermissions.pending, (state) => {
        state.screenStatus = "loading";
      })
      .addCase(fetchScreensPermissions.fulfilled, (state, action) => {
        state.screenStatus = "succeeded";
        state.screenPermissions = action.payload?.response || [];
      })
      .addCase(fetchScreensPermissions.rejected, (state, action) => {
        state.screenStatus = "failed";
        state.screenError = action.error.message;
      })

      // Add Fetch Principles cases
      .addCase(fetchPrinciples.pending, (state) => {
        state.principlesStatus = "loading";
        state.principlesError = null;
      })
      .addCase(fetchPrinciples.fulfilled, (state, action) => {
        state.principlesStatus = "succeeded";
        // Based on your API response structure, the data should be in action.payload.response
        state.principles = action.payload?.response || action.payload || [];
        console.log("✅ Principles stored in Redux:", state.principles);
      })
      .addCase(fetchPrinciples.rejected, (state, action) => {
        state.principlesStatus = "failed";
        state.principlesError = action.error.message;
        console.error("❌ Fetch principles failed:", action.error.message);
      });
  },
});

export const { clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;