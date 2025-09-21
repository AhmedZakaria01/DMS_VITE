import { createSlice } from "@reduxjs/toolkit";
import { getParentCategories } from "./CategoryThunks";

const parentCategoriesSlice = createSlice({
  name: "parentCategories",
  initialState: {
    parentCategories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearParentCategories: (state) => {
      state.parentCategories = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getParentCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParentCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.parentCategories = action.payload;
      })
      .addCase(getParentCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearParentCategories } = parentCategoriesSlice.actions;
export default parentCategoriesSlice.reducer;