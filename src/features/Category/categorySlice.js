import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategoryChilds,
  getParentCategories,
  createCategory,
} from "./categoryThunks";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    // Category form data that will be sent to backend
    categoryData: {
      name: "",
      documentTypeId: null,
      parentCategoryId: null,
      securityLevel: 0,
      aclRules: [],
    },
    parentCategories: [],
    childCategories: {},
    loading: false,
    childLoading: {},
    status: "idle",
    error: null,
  },
  reducers: {
    // Set category name
    setCategoryName: (state, action) => {
      state.categoryData.name = action.payload;
      console.log(action.payload);
    },

    // Set document type ID
    setDocumentTypeId: (state, action) => {
      state.categoryData.documentTypeId = action.payload;
      console.log(action.payload);
    },

    // Set parent category ID
    setParentCategoryId: (state, action) => {
      state.categoryData.parentCategoryId = action.payload || null;
    },

    // Set security level
    setSecurityLevel: (state, action) => {
      state.categoryData.securityLevel = action.payload || 0;
      console.log(action.payload);
      console.log(state.categoryData.securityLevel);
    },

    // Set ACL rules (permissions)
    setAclRules: (state, action) => {
      state.categoryData.aclRules = action.payload.map((ele) => ({
        principalId: ele.principalId,
        principalType: ele.principalType,
        permissions: ele.permissions?.map((perm) => perm.code),
        accessType: ele.accessType,
      }));
      console.log(state.categoryData.aclRules);
    },

    // Set complete category form data at once
    setcategoryData: (state, action) => {
      state.categoryData = {
        ...state.categoryData,
        ...action.payload,
      };
    },

    // Reset category form data
    resetcategoryData: (state) => {
      state.categoryData = {
        name: "",
        documentTypeId: null,
        parentCategoryId: null,
        securityLevel: 0,
        aclRules: [],
      };
      state.childCategories = {};
    },

    // Add a new category to the list
    addCategory: (state, action) => {
      const newCategory = action.payload;
      if (
        newCategory.parentCategoryId === null ||
        newCategory.parentCategoryId === undefined
      ) {
        // Add to parent categories
        state.categories.push(newCategory);
      } else {
        // Add to child categories
        if (!state.childCategories[newCategory.parentCategoryId]) {
          state.childCategories[newCategory.parentCategoryId] = [];
        }
        state.childCategories[newCategory.parentCategoryId].push(newCategory);
      }
    },

    // Set categories list
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    // Set loading status
    setCategoryStatus: (state, action) => {
      state.status = action.payload;
    },

    // Set error
    setCategoryError: (state, action) => {
      state.error = action.payload;
    },

    // Clear categories when document type changes
    clearCategories: (state) => {
      state.categories = [];
      state.childCategories = {};
    },

    // Reset entire category state (for component unmount)
    resetCategoryState: (state) => {
      state.categoryData = {
        name: "",
        documentTypeId: null,
        parentCategoryId: null,
        securityLevel: 0,
        aclRules: [],
      };
      state.parentCategories = [];
      state.childCategories = {};
      state.loading = false;
      state.childLoading = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔥 ADD THIS: Handle getParentCategories
      .addCase(getParentCategories.pending, (state) => {
        console.log("🔄 REDUCER: getParentCategories.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getParentCategories.fulfilled, (state, action) => {
        console.log("✅ REDUCER: getParentCategories.fulfilled");
        console.log("✅ REDUCER: action.payload:", action.payload);
        state.loading = false;
        state.parentCategories = action.payload; // 🔥 THIS IS THE KEY LINE
        state.error = null;
      })
      .addCase(getParentCategories.rejected, (state, action) => {
        console.log(
          "❌ REDUCER: getParentCategories.rejected:",
          action.payload
        );
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchCategoryChilds
      .addCase(fetchCategoryChilds.pending, (state, action) => {
        const parentId = action.meta.arg;
        state.childLoading = {
          ...state.childLoading,
          [parentId]: true,
        };
      })
      .addCase(fetchCategoryChilds.fulfilled, (state, action) => {
        console.log(action.payload);

        const parentId = action.meta.arg;
        state.childLoading = {
          ...state.childLoading,
          [parentId]: false,
        };
        state.childCategories[parentId] = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCategoryChilds.rejected, (state, action) => {
        const parentId = action.meta.arg;
        state.childLoading = {
          ...state.childLoading,
          [parentId]: false,
        };
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle createCategory
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setCategoryName,
  setDocumentTypeId,
  setParentCategoryId,
  setSecurityLevel,
  setAclRules,
  setcategoryData,
  resetcategoryData,
  addCategory,
  setCategories,
  setCategoryStatus,
  setCategoryError,
  clearCategories,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;
