import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PrivateAxios from "../../axios/PrivateAxios";
import Cookies from "js-cookie";

export const getMessageGetSenderIdReceiverId = createAsyncThunk("MessageGetSenderIdReceiverId/getMessageGetSenderIdReceiverId", async ({id,receiver}) => {
  let api = PrivateAxios();
  const token = Cookies.get("token");
  if (token) {
    const response = await api
      .get(process.env.REACT_APP_API_BACKEND + `message?sender=${id}&receiver=${receiver}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
    return response;
  }
});

const MessageGetSenderIdReceiverIdSlice = createSlice({
  name: "MessageGetSenderIdReceiverId",
  initialState: {
    isLoading: false,
    isError: null,
    MessageGetSenderIdReceiverId: [],
  },
  extraReducers: {
    [getMessageGetSenderIdReceiverId.pending]: (state) => {
      state.isLoading = true;
    },
    [getMessageGetSenderIdReceiverId.fulfilled]: (state, action) => {
      state.isLoading = false;
      if (action.payload !== undefined) {
        state.MessageGetSenderIdReceiverId = action.payload.data;
      }
    },
    [getMessageGetSenderIdReceiverId.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    },
  },
});

export default MessageGetSenderIdReceiverIdSlice.reducer;
