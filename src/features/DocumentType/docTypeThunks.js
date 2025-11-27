// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   createDocType as createDocTypeAPI,
//   getDocTypesByRepo,
//   getDocTypeById,
//   updateDocType,
//   deleteDocType
// } from "../../services/apiServices";

// // Create DocType with Attributes
// export const createDocTypeWithAttribute = createAsyncThunk(
//   "docType/createDocTypeWithAttribute",
//   async ({ payload }, { rejectWithValue }) => {
//     try {
//       const response = await createDocTypeAPI(payload);

//       // Check if response exists and has data
//       if (!response || !response.data) {
//         throw new Error("No response received from server");
//       }

//       // Return the nested response data based on your API structure
//       return response.data.response || response.data;
//     } catch (error) {
//       console.error("Create Doc Type thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to create Doc Type"
//       );
//     }
//   }
// );

// // Get Document Types by Repository
// export const getDocTypesFromRepo = createAsyncThunk(
//   "docType/getDocTypesFromRepo",
//   async (repoId, { rejectWithValue }) => {
//     try {
//       const response = await getDocTypesByRepo(repoId);

//       if (!response || !response.data) {
//         throw new Error("No response received from server");
//       }

//       return response.data.response || response.data;
//     } catch (error) {
//       console.error("Get Doc Types thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch Doc Types"
//       );
//     }
//   }
// );

// // Get Document Type by ID
// export const fetchtDocTypeByAttributes = createAsyncThunk(
//   "docType/fetchtDocTypeByAttributes",
//   async (docTypeId, { rejectWithValue }) => {
//     try {
//       const response = await getDocTypeById(docTypeId);

//       if (!response || !response.data) {
//         throw new Error("No response received from server");
//       }

//       return response.data.response || response.data;
//     } catch (error) {
//       console.error("Get Doc Type thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch Doc Type"
//       );
//     }
//   }
// );

// // Update Document Type
// export const updateDocTypeDetails = createAsyncThunk(
//   "docType/updateDocTypeDetails",
//   async ({ docTypeId, payload }, { rejectWithValue }) => {
//     try {
//       const response = await updateDocType(docTypeId, payload);

//       if (!response || !response.data) {
//         throw new Error("No response received from server");
//       }

//       return response.data.response || response.data;
//     } catch (error) {
//       console.error("Update Doc Type thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to update Doc Type"
//       );
//     }
//   }
// );

// // Delete Document Type
// export const removeDocType = createAsyncThunk(
//   "docType/removeDocType",
//   async (docTypeId, { rejectWithValue }) => {
//     try {
//       const response = await deleteDocType(docTypeId);

//       if (!response || !response.data) {
//         throw new Error("No response received from server");
//       }

//       return { docTypeId, data: response.data.response || response.data };
//     } catch (error) {
//       console.error("Delete Doc Type thunk error:", error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to delete Doc Type"
//       );
//     }
//   }
// );
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDocType as createDocTypeAPI,
  getDocTypesByRepo,
  getDocTypeByAttributes,
  updateDocType,
  deleteDocType,
} from "../../services/apiServices";

// Create DocType with Attributes
export const createDocTypeWithAttribute = createAsyncThunk(
  "docType/createDocTypeWithAttribute",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await createDocTypeAPI(payload);

      // Check if response exists and has data
      if (!response || !response.data) {
        throw new Error("No response received from server");
      }

      // Return the nested response data based on your API structure
      return response.data.response || response.data;
    } catch (error) {
      console.error("Create Doc Type thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create Doc Type"
      );
    }
  }
);

// Get Document Types by Repository
export const fetchDocTypesByRepo = createAsyncThunk(
  "docType/fetchDocTypesByRepo",
  async (repoId, { rejectWithValue }) => {
    try {
      const response = await getDocTypesByRepo(repoId);

      if (!response || !response.data) {
        throw new Error("No response received from server");
      }
      console.log(response.data?.response);

      return response.data?.response;
    } catch (error) {
      console.error("Get Doc Types thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch Doc Types"
      );
    }
  }
);

// Get Document Type by ID
export const fetchtDocTypeByAttributes = createAsyncThunk(
  "docType/fetchtDocTypeByAttributes",
  async (docTypeId, { rejectWithValue }) => {
    try {
      const response = await getDocTypeByAttributes(docTypeId);

      if (!response || !response.data) {
        throw new Error("No response received from server");
      }
      console.log(response.data.response);

      return response.data.response || response.data;
    } catch (error) {
      console.error("Get Doc Type thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch Doc Type"
      );
    }
  }
);

// Update Document Type
export const updateDocTypeDetails = createAsyncThunk(
  "docType/updateDocTypeDetails",
  async ({ docTypeId, payload }, { rejectWithValue }) => {
    try {
      const response = await updateDocType(docTypeId, payload);

      if (!response || !response.data) {
        throw new Error("No response received from server");
      }

      return response.data.response || response.data;
    } catch (error) {
      console.error("Update Doc Type thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update Doc Type"
      );
    }
  }
);

// Delete Document Type
export const removeDocType = createAsyncThunk(
  "docType/removeDocType",
  async (docTypeId, { rejectWithValue }) => {
    try {
      const response = await deleteDocType(docTypeId);

      if (!response || !response.data) {
        throw new Error("No response received from server");
      }

      return { docTypeId, data: response.data.response || response.data };
    } catch (error) {
      console.error("Delete Doc Type thunk error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete Doc Type"
      );
    }
  }
);
