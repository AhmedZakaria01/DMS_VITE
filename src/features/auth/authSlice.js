/**
 * This file defines the authentication slice using Redux Toolkit.
 * It manages the authentication state (user, status, and error), and handles login, register, and logout actions.
 */
import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";
import Cookies from "js-cookie";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: { name: null, id: null },
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = { name: null, id: null };
    },
    saveUserData: (state, user) => {
      state.user.id = Cookies.get("userId");
      state.user.name = Cookies.get("userName");
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload);

        state.status = "succeeded";
        state.user.name = action.payload.name;
        state.user.id = action.payload.id;
        Cookies.set("refreshToken", action.payload.refreshToken);
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

export const { logout, saveUserData } = authSlice.actions;
export default authSlice.reducer;
