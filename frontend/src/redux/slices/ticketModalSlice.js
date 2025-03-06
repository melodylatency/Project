import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  currentUrl: "",
};

const ticketModalSlice = createSlice({
  name: "ticketModal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
      state.currentUrl = window.location.href;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = ticketModalSlice.actions;
export default ticketModalSlice.reducer;
