import Router from "next/router";
import { Fragment, useEffect } from "react";

import { getVerificationEmail } from "../../app/redux/Slice/VerificationEmailSlice";

import { toast } from "react-toastify";
import PreLoader from "../../components/PreLoader";

import { wrapper } from "../../app/redux/store";

export const getServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
  const verifyType = ctx?.query?.type || null;
  const usersId = ctx?.query?.id || null;
  const tokenVerification = ctx?.query?.token || null;

  if (verifyType != null || usersId != null || tokenVerification != null) {
    await store.dispatch(getVerificationEmail({ verifyType, usersId, tokenVerification }));
  }
  const value = await store.getState().VerificationEmail.VerificationEmail;

  // console.log(value);

  const status = value?.status || null;
  const statusCode = value?.statusCode || null;
  const message = value?.message || null;

  const isLoading = await store.getState().VerificationEmail.isLoading;

  return {
    props: {
      status: status,
      statusCode: statusCode,
      message: message,
      verifyType: verifyType,
      usersId: usersId,
      tokenVerification: tokenVerification,
      isLoading: isLoading,
    },
  };
});

const Verification = ({ status, statusCode, message, verifyType, usersId, tokenVerification, isLoading }) => {
  
  // console.log("status : ",status);
  // console.log("statusCode : ",statusCode);
  // console.log("message : ",message);
  // console.log("verifyType : ",verifyType);
  // console.log("usersId : ",usersId);
  // console.log("tokenVerification : ",tokenVerification);
  // console.log("isLoading : ",isLoading);

  useEffect(() => {
    document.title = "Verification | WChat";

    if (verifyType == null || usersId == null || tokenVerification == null) {
      toast.warning("Url verification invalid", {  toastId: "invalidUrlVerificationEmail" });
      Router.push("/");
    } else {
      if (status != null || statusCode != null || message != null) {
        if (statusCode == 200) {
          toast.success(message, {  toastId: "successVerificationEmail" });
          Router.push("/");
        } else {
          toast.warning(message, {  toastId: "errorVerificationEmail" });
          Router.push("/");
        }
      }
    }
  }, [status, statusCode, message, verifyType, usersId, tokenVerification, isLoading]);

  return <Fragment>{verifyType == null || usersId == null || tokenVerification == null ? <PreLoader isLoading={false} /> : null}</Fragment>;
};

export default Verification;
