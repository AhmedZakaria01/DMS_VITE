import { createSlice } from "@reduxjs/toolkit";
import { createDocTypeWithAttribute, fetchDocTypeById, getDocTypesFromRepo, removeDocType, updateDocTypeDetails } from "./DocTypeThunks";



const initialState = {
  docTypes: [],
  currentDocType: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const docTypeSlice = createSlice({
  name: "docType",
  initialState,
  reducers: {
    // Reset state
    resetDocTypeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    // Clear current document type
    clearCurrentDocType: (state) => {
      state.currentDocType = null;
    },
    // Clear error
    clearDocTypeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Document Type with Attributes
      .addCase(createDocTypeWithAttribute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createDocTypeWithAttribute.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Document type created successfully";
        // Add the new document type to the list if it exists in the response
        if (action.payload.id) {
          state.docTypes.push(action.payload);
        }
      })
      .addCase(createDocTypeWithAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create document type";
        state.success = false;
      })

      // Get Document Types by Repository
      .addCase(getDocTypesFromRepo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDocTypesFromRepo.fulfilled, (state, action) => {
        state.loading = false;
        state.docTypes = action.payload;
        state.error = null;
      })
      .addCase(getDocTypesFromRepo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch document types";
        state.docTypes = [];
      })

      // Get Document Type by ID
      .addCase(fetchDocTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDocType = action.payload;
        state.error = null;
      })
      .addCase(fetchDocTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch document type";
        state.currentDocType = null;
      })

      // Update Document Type
      .addCase(updateDocTypeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateDocTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Document type updated successfully";
        // Update the document type in the list
        const index = state.docTypes.findIndex(
          (dt) => dt.id === action.payload.id
        );
        if (index !== -1) {
          state.docTypes[index] = action.payload;
        }
        // Update current document type if it's the same one
        if (state.currentDocType?.id === action.payload.id) {
          state.currentDocType = action.payload;
        }
      })
      .addCase(updateDocTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update document type";
        state.success = false;
      })

      // Delete Document Type
      .addCase(removeDocType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(removeDocType.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.data.message || "Document type deleted successfully";
        // Remove the document type from the list
        state.docTypes = state.docTypes.filter(
          (dt) => dt.id !== action.payload.docTypeId
        );
        // Clear current document type if it was deleted
        if (state.currentDocType?.id === action.payload.docTypeId) {
          state.currentDocType = null;
        }
      })
      .addCase(removeDocType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete document type";
        state.success = false;
      });
  },
});

export const { 
  resetDocTypeState, 
  clearCurrentDocType, 
  clearDocTypeError 
} = docTypeSlice.actions;

export default docTypeSlice.reducer;