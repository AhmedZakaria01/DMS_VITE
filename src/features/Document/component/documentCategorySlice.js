// import { createSlice } from "@reduxjs/toolkit";
// import { fetchtDocTypeByAttributes } from "../../DocumentType/DocTypeThunks";

// const documentCategorySlice = createSlice({
//   name: "documentCategory",
//   initialState: {
//     documentCategory: [],
//     loading: false,
//     error: null,
//     success: false,
//   },
//   reducers: {
//     // Clear document category data
//     clearDocumentCategory: (state) => {
//       state.documentCategory = [];
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//     // Reset error state
//     clearError: (state) => {
//       state.error = null;
//     },
//     // Reset success state
//     clearSuccess: (state) => {
//       state.success = false;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchtDocTypeByAttributes.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(fetchtDocTypeByAttributes.fulfilled, (state, action) => {
//         state.loading = false;
//         state.documentCategory = action.payload;
//         state.success = true;
//         state.error = null;
//       })
//       .addCase(fetchtDocTypeByAttributes.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch document category";
//         state.success = false;
//         state.documentCategory = [];
//       });
//   }
// });

// export const { clearDocumentCategory, clearError, clearSuccess } = documentCategorySlice.actions;
// export default documentCategorySlice.reducer;