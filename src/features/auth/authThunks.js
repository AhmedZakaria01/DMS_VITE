/**
 * This file contains functions for logging in and registering users.
 * It uses Redux Toolkit's createAsyncThunk to handle the async API calls.
 *
 * - login: sends user login data to the server
 * - register: sends new user data to the server to create an account
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../services/apiServices";

// Login thunk
export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await loginUser(credentials);

  return response.response;
});

// Register thunk
export const register = createAsyncThunk("auth/register", async (userData) => {
  const response = await registerUser(userData);
  return response.data;
});
