// redux/thunks/folderContentsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createFolder, getFolderContents } from "../../services/apiServices";

// Fetch User Repositories
export const fetchFolderContents = createAsyncThunk(
  "repo/fetchRepoContent",
  async ({ repoId, folderId }) => {
    const response = await getFolderContents(repoId, folderId);
    return response.data;
  }
);

// Create New Folder - FIXED VERSION
export const createNewFolder = createAsyncThunk(
  "folder/create_New_Folder",
  async (folderData) => {
    const response = await createFolder(folderData);

    // Return the entire response object, not just response.data
    // This ensures we have access to status, headers, etc.
    return response;
  }
);
