import { createSlice } from "@reduxjs/toolkit";
import { createUser, fetchUsers, fetchSpecificUser, updateUser } from "./usersThunks";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    specificUser: null,
    status: "idle",
    error: null,
    lastFetched: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle", 
    updateError: null,
    specificUserStatus: "idle", 
    specificUserError: null,
  },
  reducers: {
    resetUsersState: (state) => {
      state.users = [];
      state.specificUser = null;
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.specificUserStatus = "idle";
      state.specificUserError = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
    resetSpecificUser: (state) => {
      state.specificUser = null;
      state.specificUserStatus = "idle";
      state.specificUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
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
      
      // Fetch specific user
      .addCase(fetchSpecificUser.pending, (state) => {
        state.specificUserStatus = "loading";
        state.specificUserError = null;
      })
      .addCase(fetchSpecificUser.fulfilled, (state, action) => {
        state.specificUserStatus = "succeeded";
        state.specificUser = action.payload;
        state.specificUserError = null;
      })
      .addCase(fetchSpecificUser.rejected, (state, action) => {
        state.specificUserStatus = "failed";
        state.specificUserError = action.error.message;
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

export const { 
  resetUsersState, 
  resetCreateStatus, 
  resetUpdateStatus,
  resetSpecificUser 
} = usersSlice.actions;
export default usersSlice.reducer;