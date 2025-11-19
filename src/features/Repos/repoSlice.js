import { createSlice } from "@reduxjs/toolkit";
import { fetchUserRepos, createNewRepo, fetchAllRepos } from "./repoThunks";
import { logout } from "../auth/authSlice"; // Import logout action

const repoSlice = createSlice({
  name: "repo",
  initialState: {
    repos: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearRepos: (state) => {
      state.repos = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Repos
      .addCase(fetchUserRepos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.repos = action.payload?.response || [];
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.repos = []; // Clear repos on error
      })

      // Fetch All Repos
      .addCase(fetchAllRepos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllRepos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.repos = action.payload || [];
      })
      .addCase(fetchAllRepos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        // Clear repos on error (especially 403)
        state.repos = [];
      })

      // Create New Repo
      .addCase(createNewRepo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewRepo.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add the new repo to the existing repos array
        if (action.payload?.data) {
          state.repos.push(action.payload.data);
        }
      })
      .addCase(createNewRepo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Clear repos on logout
      .addCase(logout, (state) => {
        state.repos = [];
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearRepos } = repoSlice.actions;
export default repoSlice.reducer;
