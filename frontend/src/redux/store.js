import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice";
import questionSliceReducer from "./slices/questionSlice";
import answerSliceReducer from "./slices/answerSlice";
import templateSliceReducer from "./slices/templateSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    question: questionSliceReducer,
    answer: answerSliceReducer,
    template: templateSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
