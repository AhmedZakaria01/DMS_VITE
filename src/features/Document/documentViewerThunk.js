/**
 * This component sets up a pre-configured Axios instance with a base URL and default headers,
 * and provides reusable functions for handling Apis with encrypted token storage
 */

// redux/thunks/categoryThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewCategory,
  fetchParentCategories,
  getChildCategories,
} from "../../services/apiServices";

// Create New Category Thunk
export const createCategory = createAsyncThunk(
  "Document/createNewCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await createNewCategory(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create category"
      );
    }
  }
);

// Fetch Parent Categories Thunk
export const getParentCategories = createAsyncThunk(
  "Document/GetCategoriesByDocumentType",
  async (documentTypeId, { rejectWithValue }) => {
    try {
      const categories = await fetchParentCategories(documentTypeId);
      console.log("Parent Categories =>", categories);

      return categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch parent categories"
      );
    }
  }
);

export const fetchCategoryChilds = createAsyncThunk(
  "category/get/childs",
  async (parentCategoryId) => {
    try {
      const childCategories = await getChildCategories(parentCategoryId);
      return childCategories;
    } catch (error) {
      throw new Error(error);
    }
  }
);
