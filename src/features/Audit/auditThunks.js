// redux/thunks/repoThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuditTrail } from "../../services/apiServices";

export const fetchAuditTrail = createAsyncThunk(
  "repo/fetchAuditTrail",
  async () => {
    const response = await getAuditTrail();
    console.log(response.data.response);

    return response.data.response;
  }
);
