import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formState: localStorage.getItem("formState")
    ? JSON.parse(localStorage.getItem("formState"))
    : {},
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormState: (state, action) => {
      state.formState = action.payload;
      localStorage.setItem("formState", JSON.stringify(state.formState));
    },
    addToFormState: (state, action) => {
      state.formState = [...state.formState, action.payload];
      localStorage.setItem("formState", JSON.stringify(state.formState));
    },
  },
});

export const { setFormState, addToFormState } = formSlice.actions;

export default formSlice.reducer;
