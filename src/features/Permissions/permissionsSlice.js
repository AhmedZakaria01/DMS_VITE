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
    currentEntityType: null, // ✅ ADDED: Track current entity type
    status: "idle",
    error: null,
    loading: false, // ✅ ADDED: Explicit loading flag
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
      state.currentEntityType = null; // ✅ ADDED: Clear entity type
      state.screenPermissions = [];
      state.principles = [];
      state.status = "idle";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Permissions
      .addCase(fetchAvailablePermission.pending, (state) => {
        state.status = "loading";
        state.loading = true; // ✅ ADDED: Set loading flag
        state.error = null;
      })
      .addCase(fetchAvailablePermission.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false; // ✅ ADDED: Clear loading flag
        state.permissions = action.payload?.response || [];
        state.currentEntityType = action.meta.arg; // ✅ ADDED: Store the entityType from the request
        console.log(
          "✅ Permissions loaded for entity type:",
          state.currentEntityType
        );
      })
      .addCase(fetchAvailablePermission.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false; // ✅ ADDED: Clear loading flag
        state.error = action.error.message;
        state.currentEntityType = null; // ✅ ADDED: Clear entity type on error
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
