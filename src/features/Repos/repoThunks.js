// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewRepository,
  getAllRepos,
  getRepositoryById,
  getUserRepos,
  updateRepositoryDetails,
} from "../../services/apiServices";

// Fetch User Repositories
export const fetchAllRepos = createAsyncThunk(
  "repo/fetchAllRepos",
  async () => {
    const response = await getAllRepos();
    console.log("API response:", response); // Debug log
    return response.data.response; // Return full response to match reducer expectation
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
// Update Repository
export const editRepositoryDetails = createAsyncThunk(
  "repo/updateRepositoryDetails",
  async ({ repoId, backendData }) => {
    console.log(repoId);
    console.log(backendData);

    const response = await updateRepositoryDetails(repoId, backendData);
    console.log(response.data);

    return response.data;
  }
);
// Update Repository
export const fetchRepositoryById = createAsyncThunk(
  "repo/repositoryById",
  async (id) => {
    const response = await getRepositoryById(id);
    console.log(response.data);

    return response.data;
  }
);
