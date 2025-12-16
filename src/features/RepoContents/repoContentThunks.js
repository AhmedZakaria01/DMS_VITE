// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRepoContents } from "../../services/apiServices";

// Fetch User Repositories
export const getRepoContents = createAsyncThunk(
  "repo/fetchRepoContent",
  async (userId) => {
    const response = await fetchRepoContents(userId);
    return response;
  }
);
