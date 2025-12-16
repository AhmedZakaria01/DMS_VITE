import { createSlice } from "@reduxjs/toolkit";
import { getRepoContents } from "./repoContentThunks";

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
      .addCase(getRepoContents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRepoContents.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);

        // Combine folders and documents into a single array
        const folders = action.payload.response?.folders || [];
        const documents = action.payload.response?.documents || [];

        // Merge both arrays and add a type field to distinguish them
        state.repoContents = [
          ...folders.map(folder => ({ ...folder, type: 'Folder' })),
          ...documents.map(document => ({ ...document, type: 'Document' }))
        ];
      })
      .addCase(getRepoContents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearRepoContents } = repoContentSlice.actions;
export default repoContentSlice.reducer;
