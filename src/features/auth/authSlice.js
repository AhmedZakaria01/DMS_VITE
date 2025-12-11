/**
 * This file defines the authentication slice using Redux Toolkit.
 * It manages the authentication state (user, status, and error), and handles login, register, and logout actions.
 */
import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authThunks";
import { getRolesFromToken } from "../Users/jwtUtils";
import { decryptToken } from "../../services/apiServices";
import { setLocalStorage } from "../../../storageManager";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      name: null,
      id: null,
      roles: [],
    },
    isAdmin: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = { name: null, id: null, roles: [] };
      // 🔥 NEW: Reset isAdmin state too
      state.isAdmin = false;

      // 🔥 NEW: Clear from localStorage with logging
      console.log("Before logout - localStorage items:");
      console.log("userId:", localStorage.getItem("userId"));
      console.log("userName:", localStorage.getItem("userName"));
      console.log("token:", localStorage.getItem("token"));
      console.log("refreshToken:", localStorage.getItem("refreshToken"));
      console.log("userRoles:", localStorage.getItem("userRoles"));
      console.log("email:", localStorage.getItem("email"));

      // 🔥 IMPROVED: More systematic approach to clearing localStorage
      const keysToRemove = [
        "userId",
        "userName",
        "token",
        "refreshToken",
        "userRoles",
        "email",
      ];
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
        console.log(`Removed ${key}:`, localStorage.getItem(key)); // Should be null
      });

      // 🔥 NEW: Verify everything was cleared
      console.log("After logout - localStorage items:");
      console.log("userId:", localStorage.getItem("userId"));
      console.log("userName:", localStorage.getItem("userName"));
      console.log("token:", localStorage.getItem("token"));
      console.log("refreshToken:", localStorage.getItem("refreshToken"));
      console.log("userRoles:", localStorage.getItem("userRoles"));
      console.log("email:", localStorage.getItem("email"));
    },
    saveUserData: (state, action) => {
      state.user.id = localStorage.getItem("userId");
      state.user.name = localStorage.getItem("userName");

      // Get roles from token if available
      const encryptedToken = localStorage.getItem("token");
      if (encryptedToken) {
        const token = decryptToken(encryptedToken);
        if (token) {
          state.user.roles = getRolesFromToken(token);
          // 🔥 NEW: Set isAdmin state when loading user data
          state.isAdmin = state.user.roles.includes("Admin");
        }
      }
    },
    setUserRoles: (state, action) => {
      state.user.roles = action.payload;
      // 🔥 NEW: Update isAdmin when roles are manually set
      state.isAdmin = action.payload.includes("Admin");
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.name = action.payload.name;
        state.user.id = action.payload.id;

        // Store in localStorage
        setLocalStorage("userId", action.payload.id);
        setLocalStorage("userName", action.payload.name);
        setLocalStorage("refreshToken", action.payload.refreshToken);

        // Extract roles from token and store them
        const encryptedToken = localStorage.getItem("token");
        if (encryptedToken) {
          const token = decryptToken(encryptedToken);
          if (token) {
            state.user.roles = getRolesFromToken(token);
            // Store roles in localStorage for persistence
            setLocalStorage("userRoles", JSON.stringify(state.user.roles));

            // 🔥 FIXED: Use includes() instead of map() for boolean result
            state.isAdmin = state.user.roles.includes("Admin");
            // 🔥 IMPROVED: Better logging
            console.log("User roles:", state.user.roles);
            console.log("Is Admin?", state.isAdmin);
          }
        } else {
          console.log("No encrypted token found");
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout, saveUserData, setUserRoles } = authSlice.actions;
export default authSlice.reducer;
