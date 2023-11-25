import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getDataRequest = createAsyncThunk("firma/getAll", async () => {
  const response = await api.get("/getAll");
  return response.data;
});

export const addFirmaRequest = createAsyncThunk("firma/add", async (arg) => {
  const response = await api.post(`/add`, {
    ...arg,
  });
  return response.data;
});

export const updateFirmaRequest = createAsyncThunk(
  "firma/updateById",
  async (arg) => {
    const response = await api.put(`/updateById`, {
      ...arg,
    });
    return response.data;
  }
);

export const deleteFirmaRequest = createAsyncThunk(
  "firma/deleteById",
  async (arg) => {
    const response = await api.get(`/deleteById?id=${arg.id}`, {
      ...arg,
    });
    return response.data;
  }
);

const initialState = {
  firmaData: [],
  firmaDataLoading: false,
  firmaFormActionLoading: false,
  formData: {
    _id: "",
    firmaAdi: "",
    teklifi: null,
    teminatTutari: null,
    createdAt: "",
    updatedAt: "",
  },
};

const slice = createSlice({
  name: "firma",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDataRequest.pending, (state, action) => {
      state.firmaDataLoading = true;
    });
    builder.addCase(getDataRequest.fulfilled, (state, action) => {
      state.firmaDataLoading = false;
      state.firmaData = action.payload;
    });
    builder.addCase(addFirmaRequest.pending, (state, action) => {
      state.firmaFormActionLoading = true;
    });
    builder.addCase(addFirmaRequest.fulfilled, (state, action) => {
      state.firmaFormActionLoading = false;
    });
    builder.addCase(addFirmaRequest.rejected, (state, action) => {
      state.firmaFormActionLoading = false;
    });
    builder.addCase(updateFirmaRequest.pending, (state, action) => {
      state.firmaFormActionLoading = true;
    });
    builder.addCase(updateFirmaRequest.fulfilled, (state, action) => {
      state.firmaFormActionLoading = false;
    });
    builder.addCase(updateFirmaRequest.rejected, (state, action) => {
      state.firmaFormActionLoading = false;
    });
  },
});

export default slice.reducer;

export const {} = slice.actions;
