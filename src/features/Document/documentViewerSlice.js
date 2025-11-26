import { createSlice } from "@reduxjs/toolkit";

const documentViewerSlice = createSlice({
  name: "document",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  //   extraReducers: (builder) => {
  //     builder
  //       // Fetch User Repos
  //       .addCase(   .pending, (state) => {
  //         state.status = "loading";
  //       })
  //       .addCase(   .fulfilled, (state, action) => {
  //         state.status = "succeeded";
  //         state.folderContents = action.payload?.response || [];
  //       })
  //       .addCase(   .rejected, (state, action) => {
  //         state.status = "failed";
  //         state.error = action.error.message;
  //       });
  //   },
});

export default documentViewerSlice.reducer;
