import { createSlice } from "@reduxjs/toolkit";
import { fetchPermissions } from "./permissionsThunks";

const permissionslice = createSlice({
  name: "permissions",
  initialState: {
    permissions: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearpermissions: (state) => {
      state.permissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User permissions
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
  },
});

export default permissionslice.reducer;
