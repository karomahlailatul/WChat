import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

import SignInReducer from "./Slice/SignInSlice";
import SignUpUserReducer from "./Slice/SignUpUserSlice";

import UsersProfileReducer from "./Slice/UsersProfileSlice";
import UsersProfilePutProfileReducer from "./Slice/UsersProfilePutProfileSlice";

import VerificationEmailReducer from "./Slice/VerificationEmailSlice";
import MessageGetSenderIdReceiverIdReducer from "./Slice/MessageGetSenderIdReceiverId"
import MessageDeleteAllPrivateMessageReducer from "./Slice/MessageDeleteAllPrivateMessage"

const rootReducer = combineReducers({

  SignIn: SignInReducer,
  SignUpUser: SignUpUserReducer,

  UsersProfile: UsersProfileReducer,
  UsersProfilePutProfile : UsersProfilePutProfileReducer,

  VerificationEmail: VerificationEmailReducer,
  MessageGetSenderIdReceiverId : MessageGetSenderIdReceiverIdReducer,
  MessageDeleteAllPrivateMessage : MessageDeleteAllPrivateMessageReducer,

});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    return nextState;
  }
  return rootReducer(state, action);
};

const makeStore = () => {
  return configureStore({
    reducer: reducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const wrapper = createWrapper(makeStore, { debug: false });
