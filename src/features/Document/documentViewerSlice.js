// import { createSlice } from "@reduxjs/toolkit";
// import {
//   fetchCategoryChilds,
//   getParentCategories,
// } from "./documentViewerThunk";

// const documentViewerSlice = createSlice({
//   name: "document",
//   initialState: {
//     parentCategories: [],
//     childCategories: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Parent Categories Repos
//       .addCase(getParentCategories.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getParentCategories.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.parentCategories = action.payload;
//       })
//       .addCase(getParentCategories.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })

//       // Fetch Childs Categories
//       .addCase(fetchCategoryChilds.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchCategoryChilds.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.childCategories = action.payload;
//       })
//       .addCase(fetchCategoryChilds.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export default documentViewerSlice.reducer;

import { createSlice, current } from "@reduxjs/toolkit";
import {
  fetchCategoryChilds,
  getParentCategories,
} from "./documentViewerThunk";

const documentViewerSlice = createSlice({
  name: "document",
  initialState: {
    parentCategories: [],
    childrenByParentId: {},
    currentChildren: [],
    currentChildrenParentId: null,
    status: "idle",
    error: null,
    childCategoriesLoading: false,
    loadingChildrenFor: null,

    // Data will be send to backend
    completeJsonData: {
      documentTypeId: "",
      documentType: "",
      metadata: null,
      aclRules: [],
      Files: [],
    },
  },
  reducers: {
    // ✅ Action to clear current children
    clearCurrentChildren: (state) => {
      state.currentChildren = [];
      state.currentChildrenParentId = null;
    },
    // ✅ Action to clear all children cache
    clearAllChildren: (state) => {
      state.childrenByParentId = {};
      state.currentChildren = [];
      state.currentChildrenParentId = null;
    },

    setDocumentData: (state, action) => {
      state.completeJsonData.documentTypeId = action.payload.documentTypeId;
      state.completeJsonData.documentType = action.payload.documentType;
      state.completeJsonData.metadata = action.payload.metadata;
      state.completeJsonData.aclRules = action.payload.aclRules;
      console.log(current(state.completeJsonData));
    },

    addFilesToCategory: (state, action) => {
      const { categoryId, files } = action.payload;

      // Check if files for this category already exist
      const existingFileIndex = state.completeJsonData.Files.findIndex(
        (item) => item.categoryId === categoryId
      );

      if (existingFileIndex !== -1) {
        // Update existing category files
        state.completeJsonData.Files[existingFileIndex].files = files;
      } else {
        // Add new category with files
        state.completeJsonData.Files.push({
          categoryId,
          files,
        });
      }

      console.log("Files updated:", current(state.completeJsonData.Files));
      console.log("Complete Json Data:", current(state.completeJsonData));
    },

    // ✅ Action to remove files for a specific category
    removeFilesFromCategory: (state, action) => {
      const { categoryId } = action.payload;
      state.completeJsonData.Files = state.completeJsonData.Files.filter(
        (item) => item.categoryId !== categoryId
      );
      console.log(
        "Files after removal:",
        current(state.completeJsonData.Files)
      );
    },

    // ✅ Action to clear all files
    clearAllFiles: (state) => {
      state.completeJsonData.Files = [];
      console.log("All files cleared");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Parent Categories Repos
      .addCase(getParentCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getParentCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parentCategories = action.payload;
        // ✅ Clear children when loading new parent categories
        state.currentChildren = [];
        state.currentChildrenParentId = null;
      })
      .addCase(getParentCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // ✅ CHANGED: Fetch children and store by parent ID for nested support
      .addCase(fetchCategoryChilds.pending, (state, action) => {
        state.childCategoriesLoading = true;
        state.loadingChildrenFor = action.meta.arg;
        state.currentChildrenParentId = action.meta.arg;
        state.error = null;
      })
      .addCase(fetchCategoryChilds.fulfilled, (state, action) => {
        state.childCategoriesLoading = false;
        const parentId = action.meta.arg;
        state.loadingChildrenFor = null;
        // ✅ Store children by parent ID AND in currentChildren for compatibility
        state.childrenByParentId[parentId] = action.payload;
        state.currentChildren = action.payload;
        state.currentChildrenParentId = parentId;
      })
      .addCase(fetchCategoryChilds.rejected, (state, action) => {
        state.childCategoriesLoading = false;
        state.loadingChildrenFor = null;
        state.error = action.error.message;
      });
  },
});

export const {
  clearCurrentChildren,
  clearAllChildren,
  setDocumentData,
  addFilesToCategory,
  removeFilesFromCategory,
  clearAllFiles,
} = documentViewerSlice.actions;
export default documentViewerSlice.reducer;
