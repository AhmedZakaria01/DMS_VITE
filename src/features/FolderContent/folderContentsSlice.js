import { createSlice } from "@reduxjs/toolkit";
import { fetchFolderContents } from "./folderContentsThunks";
 
const folderContents = createSlice({
  name: "Repo Contents",
  initialState: {
    folderContents: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearFolderContents: (state) => {
      state.folderContents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Repos
      .addCase(fetchFolderContents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFolderContents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.folderContents = action.payload?.response || [];
      })
      .addCase(fetchFolderContents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default folderContents.reducer;
