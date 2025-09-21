// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFolderContents } from "../../services/apiServices";

// Fetch User Repositories
export const fetchFolderContents = createAsyncThunk(
  "repo/fetchRepoContent",
  async ({repoId, folderId}) => {
    const response = await getFolderContents(repoId, folderId);

    return response.data;
  }
);

// Create New Repository
// export const createNewRepo = createAsyncThunk(
//   "repo/createNewRepository",
//   async (repoData) => {
//     const response = await createNewRepository(repoData);
//     return response.data;
//   }
// );
