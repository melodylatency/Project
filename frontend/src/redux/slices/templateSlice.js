import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  templateData: localStorage.getItem("templateData")
    ? JSON.parse(localStorage.getItem("templateData"))
    : null,
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplateData: (state, action) => {
      state.templateData = action.payload;
      localStorage.setItem("templateData", JSON.stringify(state.templateData));
    },
    setTemplateSave: (state, action) => {
      state.templateData = null;
      localStorage.removeItem("templateData");
    },
  },
});

export const { setTemplateData, setTemplateSave } = templateSlice.actions;

export default templateSlice.reducer;
