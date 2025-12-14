import { createSlice } from "@reduxjs/toolkit";
import { createUser, fetchUsers, updateUser } from "./usersThunks";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    lastFetched: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle", 
    updateError: null,
  },
  reducers: {
    resetUsersState: (state) => {
      state.users = [];
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
        state.error = null;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.createError = null;
        // Optionally update users list
        // state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || action.error.message;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateError = null;
        // Update the user in the users array
        const index = state.users.findIndex(user => 
          user.id === action.payload.id || user.userId === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || action.error.message;
      });
  },
});

export const { resetUsersState, resetCreateStatus, resetUpdateStatus } = usersSlice.actions;
export default usersSlice.reducer;