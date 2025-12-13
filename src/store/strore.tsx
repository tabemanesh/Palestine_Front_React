import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "../reducers/panelSlice";
import uiReducer from "../reducers/uiSlider";
import martyrReducer from "../reducers/martyrSlice";
import campaignReducer from "../reducers/campaignSlice";
import empathyReducer from "../reducers/empathySlice";
import blogReducer from "../reducers/blogSlice";
import scoreReducer from "../reducers/scoreSlice";
import userReducer from "../reducers/userSlice";
import questionReducer from "../reducers/questionSlice";

export const store = configureStore({
  reducer: {
   panel: panelReducer,
   ui : uiReducer,
   martyr : martyrReducer,
   campaign : campaignReducer,
   empathy : empathyReducer,
   blog : blogReducer,
   score : scoreReducer,
   user : userReducer,
   questions : questionReducer

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;