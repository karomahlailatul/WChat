import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import PrivateAxios from "../../axios/PrivateAxios";
import Cookies from "js-cookie";

export const putGroupChatPutGroupChat = createAsyncThunk("putGroupChat/putGroupChatPutGroupChat", async ({group_chat_id, formData}) => {
  let api = PrivateAxios();

  const token = Cookies.get("token");
  if (token) {
    const response = await api
      .put(process.env.REACT_APP_API_BACKEND + "group_chat/"+ group_chat_id, formData, {
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

const putGroupChatSlice = createSlice({
  name: "putGroupChat",
  initialState: {
    isLoading: false,
    isError: null,
    putGroupChat: [],
  },
  extraReducers: {
    [putGroupChatPutGroupChat.pending]: (state) => {
      state.isLoading = true;
    },
    [putGroupChatPutGroupChat.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.putGroupChat = action.payload;
    },
    [putGroupChatPutGroupChat.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    },
  },
});

export default putGroupChatSlice.reducer;
