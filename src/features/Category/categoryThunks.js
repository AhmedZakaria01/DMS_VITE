/**
 * This component sets up a pre-configured Axios instance with a base URL and default headers,
 * and provides reusable functions for handling Apis with encrypted token storage
 */

// redux/thunks/categoryThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createNewCategory, fetchParentCategories } from "../../services/apiServices";

// Fetch User Repositories
// export const fetchUserRepos = createAsyncThunk(
//   "repo/fetchUserRepos",
//   async (userId) => {
//     const response = await getUserRepos(userId);
//     return response.data;
//   }
// );







// Create New Category Thunk
export const createNewRepo = createAsyncThunk(
  "repo/createNewCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await createNewCategory(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create category"
      );
    }
  }
);



// Fetch Parent Categories Thunk
export const getParentCategories = createAsyncThunk(
  "repo/GetCategoriesByDocumentType",
  async (documentTypeId, { rejectWithValue }) => {
    try {
      const categories = await fetchParentCategories(documentTypeId);
      return categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch parent categories"
      );
    }
  }
);