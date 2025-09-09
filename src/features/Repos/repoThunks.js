// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createNewRepository, getUserRepos } from "../../services/apiServices";

// Fetch User Repositories
export const fetchUserRepos = createAsyncThunk(
  "repo/fetchUserRepos",
  async (userId) => {
    const response = await getUserRepos(userId);
    return response.data;
  }
);

// Create New Repository
export const createNewRepo = createAsyncThunk(
  "repo/createNewRepository",
  async (repoData) => {
    const response = await createNewRepository(repoData);
    return response.data;
  }
);
