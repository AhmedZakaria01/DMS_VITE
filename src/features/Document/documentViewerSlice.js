// import { createSlice } from "@reduxjs/toolkit";

// const documentViewerSlice = createSlice({
//   name: "Repo Contents",
//   initialState: {
//     folderContents: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {
//     clearFolderContents: (state) => {
//       state.folderContents = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch User Repos
//       .addCase(fetchDocumentFiles.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchDocumentFiles.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.folderContents = action.payload?.response || [];
//       })
//       .addCase(fetchDocumentFiles.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export default documentViewerSlice.reducer;
