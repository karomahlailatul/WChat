import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PrivateAxios from "../../axios/PrivateAxios";
import Cookies from "js-cookie";

export const getUsersProfile = createAsyncThunk("UsersProfile/getUsersProfile", async () => {
  let api = PrivateAxios();
  const token = Cookies.get("token");
  if (token) {
    const response = await api
      .get(process.env.REACT_APP_API_BACKEND + "users/profile", {
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

const UsersProfileSlice = createSlice({
  name: "UsersProfile",
  initialState: {
    isLoading: false,
    isError: null,
    UsersProfile: [],
  },
  extraReducers: {
    [getUsersProfile.pending]: (state) => {
      state.isLoading = true;
    },
    [getUsersProfile.fulfilled]: (state, action) => {
      state.isLoading = false;
      if (action.payload !== undefined) {
        state.UsersProfile = action.payload.data;
      }
    },
    [getUsersProfile.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    },
  },
});

export default UsersProfileSlice.reducer;
