import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  inputs: [],
  loading: false,
  error: null,
  data: "",
  flowName: "",
};

export const saveFlow = createAsyncThunk(
  "flow/saveFlow",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { nodes, edges, flowName } = getState().flow;
      const flowId = localStorage.getItem("flowId");

      const name = flowName || "New Flow";
      let inputs = ["text"];

      const payload = {
        name,
        nodes,
        edges,
        inputs,
      };

      const method = flowId ? "PUT" : "POST";
      const endpoint = flowId ? `/api/v1/flows/${flowId}` : `/api/v1/flows`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save flow");

      const data = await res.json();
      if (!flowId && data.flow.id) {
        localStorage.setItem("flowId", data.flow.id);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to fetch dynamic input fields for a node type
export const fetchNodeInputs = createAsyncThunk(
  "flow/fetchNodeInputs",
  async (typeId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/v1/nodes/${typeId}`);
      if (!res.ok) throw new Error("Failed to fetch node inputs");
      const data = await res.json();
      return data.inputTypes;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    // Set full nodes list
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },

    // Set full edges list
    setEdges: (state, action) => {
      state.edges = action.payload;
    },

    // Add a single node
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },

    // Add a single edge
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },

    // Set selected node for editing
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },

    // Update a node's data (label, etc.)
    updateNode: (state, action) => {
      const updated = action.payload;
      state.nodes = state.nodes.map((node) =>
        node.id === updated.id ? updated : node
      );

      if (state.selectedNode?.id === updated.id) {
        state.selectedNode = updated;
      }
    },

    // Reset entire flow state
    resetFlow: () => initialState,
  },

  // Handle async input field fetching
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodeInputs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.inputs = [];
      })
      .addCase(fetchNodeInputs.fulfilled, (state, action) => {
        state.loading = false;
        state.inputs = action.payload;
      })
      .addCase(fetchNodeInputs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.inputs = [];
      })
      .addCase(saveFlow.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveFlow.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveFlow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setNodes,
  setEdges,
  addNode,
  addEdge,
  setSelectedNode,
  updateNode,
  resetFlow,
} = flowSlice.actions;

// Export reducer
export default flowSlice.reducer;
