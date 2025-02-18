import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tagMap: localStorage.getItem("tagMap")
    ? JSON.parse(localStorage.getItem("tagMap"))
    : {},
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    updateTag: (state, action) => {
      const { templateId, tag } = action.payload;
      if (!state.tagMap[templateId]) {
        state.tagMap[templateId] = [];
      }
      state.tagMap[templateId].push(tag);
      localStorage.setItem("tagMap", JSON.stringify(state.tagMap));
    },
    clearTemplateTags: (state, action) => {
      const templateId = action.payload;
      if (state.tagMap[templateId]) {
        delete state.tagMap[templateId];
        localStorage.setItem("tagMap", JSON.stringify(state.tagMap));
      }
    },
  },
});

export const { clearTemplateTags, updateTag } = tagSlice.actions;
export default tagSlice.reducer;
