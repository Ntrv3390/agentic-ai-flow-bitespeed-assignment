import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchNodeTypes = createAsyncThunk(
  "nodeTypes/fetchNodeTypes",
  async () => {
    const res = await fetch("/api/v1/nodes");
    if (!res.ok) throw new Error("Failed to fetch node types");
    return await res.json();
  }
);

const nodeTypeSlice = createSlice({
  name: "nodeTypes",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodeTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNodeTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNodeTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default nodeTypeSlice.reducer;
