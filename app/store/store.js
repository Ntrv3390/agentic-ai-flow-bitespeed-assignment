import { configureStore } from "@reduxjs/toolkit";
import nodeTypeReducer from "@/app/features/nodeTypeSlice";
import flowReducer from "@/app/features/flowSlice";

export const store = configureStore({
  reducer: {
    nodeType: nodeTypeReducer,
    flow: flowReducer,
  },
});
