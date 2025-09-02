// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../../services/apiServices";
import {createNewUser} from "../../services/apiServices";
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await getUsers();
  console.log(response.data.response);

  return response.data.response;
});
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData) => {
    const response = await createNewUser(userData);
    console.log(response);

    return response.data.response;
  }
);
