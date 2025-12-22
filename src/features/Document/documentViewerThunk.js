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
  upload_Single_File,
  delete_Single_File,
  createNewDocument,
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
export const upload_File = createAsyncThunk(
  "Document/uploadFile",
  async ({ file, categoryId }) => {
    console.log("🔶 upload_File THUNK CALLED");
    console.log("🔶 Received file:", {
      name: file?.name,
      type: file?.type,
      size: file?.size,
      isFile: file instanceof File,
      isBlob: file instanceof Blob,
    });
    console.log("🔶 categoryId:", categoryId);

    try {
      console.log("🔶 Calling upload_Single_File API...");
      const response = await upload_Single_File(file);
      console.log("🔶 upload_Single_File API returned:", response);

      // Return response with categoryId included
      const result = {
        ...response,
        categoryId,
      };
      console.log("🔶 upload_File THUNK SUCCESS, returning:", result);
      return result;
    } catch (error) {
      console.error("🔶 upload_File THUNK ERROR:", error);
      console.error("🔶 Error message:", error.message);
      console.error("🔶 Error response:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload file"
      );
    }
  }
);
export const delete_File = createAsyncThunk(
  "Document/deleteFile",
  async (tempFileId) => {
    try {
      const response = await delete_Single_File(tempFileId);
      // Return the tempFileId so we can remove it from state
      return {
        ...response,
        tempFileId,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete file"
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

// Create Document Thunk
export const createDocument = createAsyncThunk(
  "Document/createDocument",
  async (documentData, { rejectWithValue }) => {
    try {
      const response = await createNewDocument(documentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create document"
      );
    }
  }
);
