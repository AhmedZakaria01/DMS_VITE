import { createSlice } from "@reduxjs/toolkit";
import { fetchPermissions, fetchScreensPermissions } from "./permissionsThunks";

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: [],
    status: "idle",
    error: null,
    screenPermissions: [],
    screenStatus: "idle",
    screenError: null,
  },
  reducers: {
    clearPermissions: (state) => {
      state.permissions = [];
      state.screenPermissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.permissions = action.payload?.response || [];
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
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
      });
  },
});

export const { clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
