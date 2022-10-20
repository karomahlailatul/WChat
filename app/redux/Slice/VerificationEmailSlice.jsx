import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getVerificationEmail = createAsyncThunk("VerificationEmail/getVerificationEmail", async ({ verifyType, usersId, tokenVerification }) => {
  //   console.log(verifyType);
  //   console.log(usersId);
  //   console.log(tokenVerification);

  if (verifyType == "email") {
    const response = await axios
      .get(process.env.REACT_APP_API_BACKEND + `users/verify?id=${usersId}&token=${tokenVerification}`, {
        headers: {
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

const VerificationEmailSlice = createSlice({
  name: "VerificationEmail",
  initialState: {
    isLoading: false,
    isError: null,
    VerificationEmail: [],
  },
  extraReducers: {
    [getVerificationEmail.pending]: (state) => {
      state.isLoading = true;
    },
    [getVerificationEmail.fulfilled]: (state, action) => {
      state.isLoading = false;
      //   state.VerificationEmail = action.payload;
      if (action.payload !== undefined) {
        state.VerificationEmail = action.payload;
      }
    },
    [getVerificationEmail.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    },
  },
});

export default VerificationEmailSlice.reducer;
