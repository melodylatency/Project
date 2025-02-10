// redux/slices/answerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  answerMap: localStorage.getItem("answerMap")
    ? JSON.parse(localStorage.getItem("answerMap"))
    : {},
};

const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    setAnswerMap: (state, action) => {
      state.answerMap = action.payload;
      localStorage.setItem("answerMap", JSON.stringify(state.answerMap));
    },
    updateAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answerMap[questionId] = answer;
      localStorage.setItem("answerMap", JSON.stringify(state.answerMap));
    },
  },
});

export const { setAnswerMap, updateAnswer } = answerSlice.actions;
export default answerSlice.reducer;
