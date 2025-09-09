import { createSlice } from "@reduxjs/toolkit";
import { fetchAuditTrail } from "./auditThunks";

const auditSlice = createSlice({
  name: "audits",
  initialState: {
    audits: [],
    status: "idle", // Move this inside initialState
    error: null, // Move this inside initialState
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditTrail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAuditTrail.fulfilled, (state, action) => {
        state.status = "succeeded"; // Add this line
        state.audits = action.payload;
        state.error = null; // Clear any previous errors
        console.log(action.payload);
      })
      .addCase(fetchAuditTrail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default auditSlice.reducer;
