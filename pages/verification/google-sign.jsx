import { Fragment, useEffect } from "react";
import Cookies from "js-cookie";

export const getServerSideProps = async (ctx) => {
  const code = (await ctx?.query?.code) || null;
  let resultEncode;
  
  // eslint-disable-next-line no-useless-escape
  const notBase64 = /[^A-Z0-9+\/=]/i;

  function isBase64(str) {
    const len = str.length;
    if (!len || len % 4 !== 0 || notBase64.test(str)) {
      return false;
    }
    const firstPaddingChar = str.indexOf("=");
    return firstPaddingChar === -1 || firstPaddingChar === len - 1 || (firstPaddingChar === len - 2 && str[len - 1] === "=");
  }

  if (isBase64(code)) {
    let bufferDataDecode = Buffer.from(code, "base64");
    let resultBase64DataEncode = bufferDataDecode.toString("utf8");
    resultEncode = JSON.parse(resultBase64DataEncode);
  }

  const id = resultEncode?.id || null;
  const token = resultEncode?.token || null;
  const refreshToken = resultEncode?.refreshToken || null;
  const session_id = resultEncode?.session_id || null;
  
  return {
    props: {
      token: token,
      id: id,
      session_id: session_id,
      refreshToken: refreshToken,
    },
  };
};

const SignGoogle = ({ token, id, session_id, refreshToken }) => {
  useEffect(() => {
    document.title = "Verification | WChat";

    if (token != null && refreshToken != null && id != null && session_id != null) {
      Cookies.set("token", token);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("id", id);
      Cookies.set("sessionId", session_id);
    }
    return () => {
      setTimeout(() => {
        window.close();
      }, 50);
    };
  }, [token,refreshToken,id,session_id]);

  return (
  <Fragment>
   </Fragment>)
};

export default SignGoogle;
