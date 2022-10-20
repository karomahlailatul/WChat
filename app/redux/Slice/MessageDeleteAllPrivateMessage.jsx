import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import Cookies from "js-cookie";
import PrivateAxios from "../../axios/PrivateAxios";

export const deleteMessageDeleteAllPrivateMessage = createAsyncThunk("MessageDeleteAllPrivateMessage/deletedSelectedMessageDeleteAllPrivateMessage", async ({sender,receiver}) => {
  let api = PrivateAxios();
  // try {
    // console.log(sender,receiver)
    const token = Cookies.get("token");
    // const id_saved_recipes = localStorage.getItem("id");
    if (token) {
      const response = await api.delete(process.env.REACT_APP_API_BACKEND + `message/delete-sender-receiver?sender=${sender}&receiver=${receiver}`, {
          headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          // console.log(res)
          toast.success(res.data.message);
          return res.data;
        })
        .catch((err) => {
          toast.success(err);
          return err.response.data.message;
        });
      return response;
    }
});


const MessageDeleteAllPrivateMessageSlice = createSlice({
  name: "MessageDeleteAllPrivateMessage",
  initialState: {
    isLoading: false,
    isError: null,
    MessageDeleteAllPrivateMessage: [],
  },
  extraReducers: {
    [deleteMessageDeleteAllPrivateMessage.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteMessageDeleteAllPrivateMessage.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.MessageDeleteAllPrivateMessage = action.payload;
      // console.log(action.payload)
    },
    [deleteMessageDeleteAllPrivateMessage.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    },
  },
});

export default MessageDeleteAllPrivateMessageSlice.reducer;
