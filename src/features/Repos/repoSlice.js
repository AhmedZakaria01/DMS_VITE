import { createSlice } from "@reduxjs/toolkit";
import { fetchUserRepos } from "./repoThunks";

const repoSlice = createSlice({
  name: "repo",
  initialState: {},
  status: "idle",
  error: null,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRepos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        console.log(action.payload);
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default repoSlice.reducer;
