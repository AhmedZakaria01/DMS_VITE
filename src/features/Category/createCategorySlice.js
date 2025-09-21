import { createSlice } from "@reduxjs/toolkit";
import { createNewRepo } from "./CategoryThunks";

const createCategorySlice = createSlice({
  name: "createCategory",
  initialState: {
    createdCategories: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCreateCategoryState: (state) => {
      state.createdCategories = [];
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewRepo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewRepo.fulfilled, (state, action) => {
        state.loading = false;
        state.createdCategories = action.payload;
        state.success = true;
      })
      .addCase(createNewRepo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCreateCategoryState, resetCreateCategory } = createCategorySlice.actions;
export default createCategorySlice.reducer;