// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserRepos } from "../../services/apiServices";

export const fetchUserRepos = createAsyncThunk(
  "repo/fetchUserRepos",
  async (userId) => {
    const response = await getUserRepos(userId);
    return response.data;
  }
);
