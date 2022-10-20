import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateAxios from "../../axios/PrivateAxios";
import Cookies from "js-cookie";

export const putUsersProfilePutProfile = createAsyncThunk("UsersProfilePutProfile/putUsersProfilePutProfile", async (formData) => {
  let api = PrivateAxios();

  const token = Cookies.get("token");
  if (token) {
    const response = await api
      .put(process.env.REACT_APP_API_BACKEND + "users/profile?update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message, { toastId: "successUpdateUsers" });
        return res.data
      })
      .catch((err) => {
        toast.warning(err.response.data.message, { toastId: "warningUpdateUsers" });
        return err.response.data
      });
    return response;
  }
});

const UsersProfilePutProfileSlice = createSlice({
  name: "UsersProfilePutProfile",
  initialState: {
    isLoading: false,
    isError: null,
    UsersProfilePutProfile: [],
  },
  extraReducers: {
    [putUsersProfilePutProfile.pending]: (state) => {
      state.isLoading = true;
    },
    [putUsersProfilePutProfile.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.UsersProfilePutProfile = action.payload;
    },
    [putUsersProfilePutProfile.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    },
  },
});

export default UsersProfilePutProfileSlice.reducer;
