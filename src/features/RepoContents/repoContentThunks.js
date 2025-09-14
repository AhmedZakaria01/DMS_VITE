// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRepoContents } from "../../services/apiServices";

// Fetch User Repositories
export const fetchRepoContents = createAsyncThunk(
  "repo/fetchRepoContent",
  async (userId) => {
    const response = await getRepoContents(userId);
    // console.log(response);
    
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
