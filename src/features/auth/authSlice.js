/**
 * This file defines the authentication slice using Redux Toolkit.
 * It manages the authentication state (user, status, and error), and handles login, register, and logout actions.
 */
import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";
import Cookies from "js-cookie"; // Correct import name for js-cookie
import { getRolesFromToken } from "../Users/jwtUtils";
import { decryptToken } from "../../services/apiServices";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      name: null,
      id: null,
      roles: [],
    },
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = { name: null, id: null, roles: [] };
      // Clear from localStorage
      localStorage.removeItem("userRoles");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    saveUserData: (state, action) => {
      // Fixed: added action parameter
      state.user.id = localStorage.getItem("userId");
      state.user.name = localStorage.getItem("userName");

      // Get roles from token if available
      const encryptedToken = localStorage.getItem("token"); // Fixed: removed extra "Item"
      if (encryptedToken) {
        const token = decryptToken(encryptedToken);
        if (token) {
          state.user.roles = getRolesFromToken(token);
        }
      }
    },
    setUserRoles: (state, action) => {
      state.user.roles = action.payload;
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.name = action.payload.name;
        state.user.id = action.payload.id;

        // Store in localStorage
        localStorage.setItem("userId", action.payload.id);
        localStorage.setItem("userName", action.payload.name);
        localStorage.setItem("refreshToken", action.payload.refreshToken);

        // Extract roles from token and store them
        const encryptedToken = localStorage.getItem("token");
        if (encryptedToken) {
          const token = decryptToken(encryptedToken);
          if (token) {
            state.user.roles = getRolesFromToken(token);
            // Store roles in localStorage for persistence
            localStorage.setItem("userRoles", JSON.stringify(state.user.roles));
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout, saveUserData, setUserRoles } = authSlice.actions;
export default authSlice.reducer;
