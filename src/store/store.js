import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import repoReducer from "../features/Repos/repoSlice";
export const store = configureStore({
  reducer: {
    // Auth
    authReducer,
    repoReducer,
  },
});
