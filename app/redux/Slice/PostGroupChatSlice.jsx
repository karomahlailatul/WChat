import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import PrivateAxios from "../../axios/PrivateAxios";
import Cookies from "js-cookie";

export const postGroupChatPostGroupChat = createAsyncThunk("postGroupChat/postGroupChatPostGroupChat", async (formData) => {
  let api = PrivateAxios();

  const token = Cookies.get("token");
  if (token) {
    const response = await api
      .post(process.env.REACT_APP_API_BACKEND + "group_chat", formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message, { toastId: "successCreateGroup" });
        return res.data
      })
      .catch((err) => {
        toast.warning(err.response.data.message, { toastId: "warningCreateGroup" });
        return err.response.data
      });
    return response;
  }
});

const postGroupChatSlice = createSlice({
  name: "postGroupChat",
  initialState: {
    isLoading: false,
    isError: null,
    postGroupChat: [],
  },
  extraReducers: {
    [postGroupChatPostGroupChat.pending]: (state) => {
      state.isLoading = true;
    },
    [postGroupChatPostGroupChat.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.postGroupChat = action.payload;
    },
    [postGroupChatPostGroupChat.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    },
  },
});

export default postGroupChatSlice.reducer;
