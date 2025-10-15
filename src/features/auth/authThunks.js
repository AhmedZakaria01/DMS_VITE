/**
 * This file contains functions for logging in and registering users.
 * It uses Redux Toolkit's createAsyncThunk to handle the async API calls.
 *
 * - login: sends user login data to the server
 * - register: sends new user data to the server to create an account
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptToken, loginUser, registerUser } from "../../services/apiServices";
import Cookies from "js-cookie"; 
import { getRolesFromToken } from "../Users/jwtUtils";

// Login thunk
export const login = createAsyncThunk("auth/login", async (credentials, { dispatch }) => {
  const response = await loginUser(credentials);
  
  // Extract roles from the token if needed immediately
  const encryptedToken = Cookies.get("token");
  if (encryptedToken) {
    const token = decryptToken(encryptedToken);
    if (token) {
      const roles = getRolesFromToken(token);
    }
  }
  
  return response.response;
});

// Register thunk
export const register = createAsyncThunk("auth/register", async (userData) => {
  const response = await registerUser(userData);
  return response.data;
});
