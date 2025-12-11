import { createSlice, current } from "@reduxjs/toolkit";
import {
  fetchCategoryChilds,
  getParentCategories,
  upload_File,
  delete_File,
  createDocument,
} from "./documentViewerThunk";
import { unknown } from "zod";

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

    // Document creation status (separate from categories loading)
    documentCreationStatus: "idle",
    documentCreationError: null,

    // Data will be send to backend
    completeJsonData: {
      repositoryId: null,
      documentTypeId: "",
      title: "",
      securityLevel: 0, // Document-level security level (0-99), defaults to 0
      attributes: [], // Array of { attributeId: number, value: string }
      aclRules: [],
      filesMetaData: [], // Store all file metadata (tempFileId, originalName, categoryId, securityLevel, aclRules)
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
      state.completeJsonData.repositoryId = action.payload.repoId;
      state.completeJsonData.documentTypeId = action.payload.documentTypeId;
      state.completeJsonData.title = "unknown";
      state.completeJsonData.securityLevel = action.payload.securityLevel ?? 0;
      state.completeJsonData.attributes = action.payload.attributes;
      state.completeJsonData.aclRules = action.payload.aclRules;
    },

    // ✅ Action to clear all files metadata
    clearAllFiles: (state) => {
      state.completeJsonData.filesMetaData = [];
    },

    // Set security level for a file
    setFileSecurityLevel: (state, action) => {
      const { tempFileId, securityLevel } = action.payload;
      const fileIndex = state.completeJsonData.filesMetaData.findIndex(
        (file) => file.tempFileId === tempFileId
      );

      if (fileIndex !== -1) {
        state.completeJsonData.filesMetaData[fileIndex].securityLevel =
          securityLevel;
        console.log(
          "📁 Files Metadata:",
          current(state.completeJsonData.filesMetaData)
        );
      }
    },

    // Set ACL rules for a file
    setFileAclRules: (state, action) => {
      const { tempFileId, aclRules } = action.payload;
      const fileIndex = state.completeJsonData.filesMetaData.findIndex(
        (file) => file.tempFileId === tempFileId
      );

      if (fileIndex !== -1) {
        state.completeJsonData.filesMetaData[fileIndex].aclRules = aclRules;
        console.log(
          "📁 Files Metadata:",
          current(state.completeJsonData.filesMetaData)
        );
      }
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

      // Upload File
      .addCase(upload_File.pending, (state) => {
        state.status = "loading";
      })
      .addCase(upload_File.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Store file metadata (tempFileId, originalName, categoryId, securityLevel, aclRules)
        if (action.payload) {
          state.completeJsonData.filesMetaData.push({
            tempFileId: action.payload.tempFileId,
            originalName: action.payload.originalName,
            categoryId: action.payload.categoryId,
            securityLevel: null,
            aclRules: [],
          });
          console.log(
            "📁 Files Metadata:",
            current(state.completeJsonData.filesMetaData)
          );
        }
      })
      .addCase(upload_File.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Delete File
      .addCase(delete_File.pending, (state) => {
        state.status = "loading";
      })
      .addCase(delete_File.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Remove the file from filesMetaData array
        if (action.payload && action.payload.tempFileId) {
          state.completeJsonData.filesMetaData =
            state.completeJsonData.filesMetaData.filter(
              (file) => file.tempFileId !== action.payload.tempFileId
            );
          console.log(
            "📁 Files Metadata:",
            current(state.completeJsonData.filesMetaData)
          );
        }
      })
      .addCase(delete_File.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Create Document
      .addCase(createDocument.pending, (state) => {
        state.documentCreationStatus = "loading";
        state.documentCreationError = null;
      })
      .addCase(createDocument.fulfilled, (state) => {
        state.documentCreationStatus = "succeeded";
        state.documentCreationError = null;
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.documentCreationStatus = "failed";
        state.documentCreationError = action.payload || action.error.message;
      })

      // Fetch children and store by parent ID for nested support
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
  clearAllFiles,
  setFileSecurityLevel,
  setFileAclRules,
} = documentViewerSlice.actions;
export default documentViewerSlice.reducer;
