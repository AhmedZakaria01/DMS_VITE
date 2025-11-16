// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createFolder, getFolderContents } from "../../services/apiServices";

// Fetch User Repositories
export const fetchFolderContents = createAsyncThunk(
  "repo/fetchRepoContent",
  async ({repoId, folderId}) => {
    const response = await getFolderContents(repoId, folderId);

    return response.data;
  }
);

// Create New Folder
export const createNewFolder = createAsyncThunk(
  "repo/createNewRepository",
  async (folderData) => {
    const response = await createFolder(folderData);
    return response.data;
  }
);
