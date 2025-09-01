/**
 * UI Slice Handles Any Generic Ui Logic or Data
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPopupOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openPopup: (state) => {
      state.isPopupOpen = true;
    },
    closePopup: (state) => {
      state.isPopupOpen = false;
    },
  },
});

export const { openPopup, closePopup } = uiSlice.actions;
export default uiSlice.reducer;
