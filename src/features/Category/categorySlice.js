import { createSlice } from "@reduxjs/toolkit";
import { fetchUserRepos } from "../Repos/repoThunks";
import { createNewRepo } from "./CategoryThunks";

const categorySlice = createSlice({
  name: "repo",
  initialState: {
    repos: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearRepos: (state) => {
      state.repos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Repos
      .addCase(fetchUserRepos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.repos = action.payload?.response || [];
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create New Repo - ADD THIS BACK
      .addCase(createNewRepo.fulfilled, (state, action) => {
        // Add the new repo to the existing repos array
        if (action.payload?.data) {
          state.repos.push(action.payload.data);
        }
      });
  },
});

export default categorySlice.reducer;
