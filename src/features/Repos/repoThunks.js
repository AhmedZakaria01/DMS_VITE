// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createNewRepository, getAllRepos, getUserRepos } from "../../services/apiServices";

// Fetch User Repositories
export const fetchAllRepos = createAsyncThunk(
  "repo/fetchAllRepos",
  async () => {
    const response = await getAllRepos();
    return response.data;
  }
); // Fetch User Repositories
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
    console.log(response.data);

    return response.data;
  }
);
