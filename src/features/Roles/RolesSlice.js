import { createSlice } from "@reduxjs/toolkit";
import { createRole, fetchRoles } from "./RolesThunks";

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastFetched: null,
  },
  reducers: {},
extraReducers: (builder) => {
  builder
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
    // Add createRole cases
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
    });
},
});

export default rolesSlice.reducer;
