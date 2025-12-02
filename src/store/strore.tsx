import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "../reducers/panelSlice";
import uiReducer from "../reducers/uiSlider";
export const store = configureStore({
  reducer: {
   panel: panelReducer,
   ui :uiReducer

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;