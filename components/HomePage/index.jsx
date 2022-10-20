import { useState, useEffect, Fragment } from "react";
import HomeAuth from "../HomeAuth";
import Image from "next/image";
import Cookies from "js-cookie";
import useWindowSize from "../WindowsSize";

import HomeChat from "../HomeChat";

import socket from "../../app/socket-io.client";
import PreLoader from "../PreLoader";

import { Desktop, Mobile } from "../../components/Responsive";

const HomePage = () => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [id, setId] = useState("");
  const [sessionId, setSessionId] = useState("");

  const size = useWindowSize();

  useEffect(() => {
    setToken(Cookies.get("token"));
    setRefreshToken(Cookies.get("refreshToken"));
    setId(Cookies.get("id"));
    setSessionId(Cookies.get("sessionId"));

    if (sessionId) {
      socket.auth = { sessionId };
      socket.connect();
    }

    socket.on("connect_error", (err) => {
      console.log(err);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, token, refreshToken, sessionId, id]);

  return (
    <Fragment>
      {token && refreshToken && sessionId && id ? (
        <Fragment>
          <HomeChat token={token} setToken={setToken} refreshToken={refreshToken} setRefreshToken={setRefreshToken} sessionId={sessionId} setSessionId={setSessionId} id={id} setId={setId} />
        </Fragment>
      ) : (
        <Fragment>
          {/* <Desktop>
            <Fragment> */}
              <div className="home-page">
                <div className="container bg-white rounded shadow ">
                  <HomeAuth token={token} setToken={setToken} refreshToken={refreshToken} setRefreshToken={setRefreshToken} sessionId={sessionId} setSessionId={setSessionId} id={id} setId={setId} />
                </div>
              </div>
            {/* </Fragment>
          </Desktop>
          <Mobile>
            <Fragment>
              <div className="home-page-mobile ">
                <div className="container bg-white rounded shadow">
                  <UsersSingUpSignIn token={token} setToken={setToken} refreshToken={refreshToken} setRefreshToken={setRefreshToken} sessionId={sessionId} setSessionId={setSessionId} id={id} setId={setId} />
                </div>
              </div>
            </Fragment>
          </Mobile> */}
        </Fragment>
      )}
    </Fragment>
  );
};

export default HomePage;
