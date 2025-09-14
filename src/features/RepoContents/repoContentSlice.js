import { createSlice } from "@reduxjs/toolkit";
import { fetchRepoContents } from "./repoContentThunks";

const repoContentSlice = createSlice({
  name: "Repo Contents",
  initialState: {
    repoContents: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearRepoContents: (state) => {
      state.repoContents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Repos
      .addCase(fetchRepoContents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRepoContents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.repoContents = action.payload?.response || [];
      })
      .addCase(fetchRepoContents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default repoContentSlice.reducer;
