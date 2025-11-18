import { createSlice } from "@reduxjs/toolkit";
import { createUser, fetchUsers } from "./usersThunks";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    lastFetched: null,
    createStatus: "idle", // Separate status for create operation
    createError: null,
  },
  reducers: {
    resetUsersState: (state) => {
      state.users = [];
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
      state.createStatus = "idle";
      state.createError = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
      state.createError = null;
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
        // state.users.push(action.payload); // Optionally add the new user to the users array
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || action.error.message;
      });
  },
});

export const { resetUsersState, resetCreateStatus } = usersSlice.actions;
export default usersSlice.reducer;
