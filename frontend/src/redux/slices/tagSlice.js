import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tagList: localStorage.getItem("tagList")
    ? JSON.parse(localStorage.getItem("tagList"))
    : [],
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    addTag: (state, action) => {
      const tag = action.payload;
      state.tagList = [...state.tagList, tag];
      localStorage.setItem("tagList", JSON.stringify(state.tagList));
    },
    removeTag: (state, action) => {
      const tagIndex = action.payload;
      state.tagList = state.tagList.filter((_, i) => i !== tagIndex);
      localStorage.setItem("tagList", JSON.stringify(state.tagList));
    },
    clearTemplateTags: (state, action) => {
      state.tagList = [];
      localStorage.setItem("tagList", JSON.stringify(state.tagList));
    },
  },
});

export const { addTag, removeTag, clearTemplateTags } = tagSlice.actions;
export default tagSlice.reducer;
