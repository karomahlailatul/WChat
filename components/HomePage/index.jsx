import { useState, useEffect, Fragment } from "react";
import HomeAuth from "../HomeAuth";
import Cookies from "js-cookie";
import HomeChat from "../HomeChat";
import socket from "../../app/socket-io.client";

const HomePage = () => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [id, setId] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [title, setTittle] = useState(0);
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

  useEffect(()=> {
    if (title == 0) { 
      document.title = `WChat | Chatting Everywhere`;
    } 
    if (title != 0) { 
      document.title = `(${title}) New Messages | WChat`;
    } 
    
  }, [title]);
  return (
    <Fragment>
      {token && refreshToken && sessionId && id ? (
        <Fragment>
          <HomeChat 
              token={token} 
              setToken={setToken} 
              refreshToken={refreshToken} 
              setRefreshToken={setRefreshToken} 
              sessionId={sessionId} 
              setSessionId={setSessionId} 
              id={id} 
              setId={setId} 
              title={title} 
              setTittle={setTittle} 
              />
        </Fragment>
      ) : (
        <Fragment>
          <div className="home-page">
            <div className="container bg-white rounded shadow ">
              <HomeAuth 
              token={token} 
              setToken={setToken} 
              refreshToken={refreshToken} 
              setRefreshToken={setRefreshToken} 
              sessionId={sessionId} 
              setSessionId={setSessionId} 
              id={id} 
              setId={setId} 
              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default HomePage;
