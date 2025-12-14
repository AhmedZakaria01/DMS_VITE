import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, createNewUser, updateNewUser, GetSpecificUser } from "../../services/apiServices";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await getAllUsers();
  console.log(response.data.response);
  return response.data.response;
});
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData) => {
    const response = await createNewUser(userData);
    // console.log(response);
    return response.data.response;
  }
);
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData) => {
    const response = await updateNewUser(userData);
    return response.data.response;
  }
);
export const fetchSpecificUser = createAsyncThunk(
  "users/fetchSpecificUser",
  async (userId) => {
    const response = await GetSpecificUser(userId);
    return response.data.response;
  }
);