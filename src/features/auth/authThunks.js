/**
 * This file contains functions for logging in and registering users.
 * It uses Redux Toolkit's createAsyncThunk to handle the async API calls.
 *
 * - login: sends user login data to the server
 * - register: sends new user data to the server to create an account
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptToken, loginUser } from "../../services/apiServices";
import { getRolesFromToken } from "../Users/jwtUtils";

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    const response = await loginUser(credentials);

    // Extract roles from the token if needed immediately
    const encryptedToken = localStorage.getItem("token");
    if (encryptedToken) {
      const token = decryptToken(encryptedToken);
      if (token) {
        const roles = getRolesFromToken(token);
      }
    }

    return response.response;
  }
);
