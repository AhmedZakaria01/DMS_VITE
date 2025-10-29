/**
 * This file defines the authentication slice using Redux Toolkit.
 * It manages the authentication state (user, status, and error), and handles login, register, and logout actions.
 */
import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";
import Cookies from "js-cookie";
import { getRolesFromToken } from "../Users/jwtUtils";
import { decryptToken } from "../../services/apiServices";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: { 
      name: null, 
      id: null,
      roles: []
    },
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = { name: null, id: null, roles: [] };
      // Also clear roles from cookies if needed
      Cookies.remove("userRoles");
    },
    saveUserData: (state, user) => {
      state.user.id = Cookies.get("userId");
      state.user.name = Cookies.get("userName");
      
      // Get roles from token if available
      const encryptedToken = Cookies.get("token");
      if (encryptedToken) {
        const token = decryptToken(encryptedToken); 
        if (token) {
          state.user.roles = getRolesFromToken(token);
        }
      }
    },
    setUserRoles: (state, action) => {
      state.user.roles = action.payload;
    }
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        // console.log(action.payload);

        state.status = "succeeded";
        state.user.name = action.payload.name;
        state.user.id = action.payload.id;
        Cookies.set("refreshToken", action.payload.refreshToken);
        
        // Extract roles from token and store them
        const encryptedToken = Cookies.get("token");
        if (encryptedToken) {
          const token = decryptToken(encryptedToken);
          if (token) {
            state.user.roles = getRolesFromToken(token);
            // Optionally store roles in cookies for persistence
            Cookies.set("userRoles", JSON.stringify(state.user.roles));
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