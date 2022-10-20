import { useState, Fragment, useEffect } from "react";
// import useWindowSize from "../WindowsSize";
import UsersChatSideBar from "../HomeChatPanelSideBar";
import UsersChatMessage from "../HomeChatPanelMessage";
import socket from "../../app/socket-io.client";

import { useDispatch, useSelector } from "react-redux";

import { getUsersProfile } from "../../app/redux/Slice/UsersProfileSlice";

import PreLoader from "../PreLoader";

const UsersChat = ({ token, setToken, refreshToken, setRefreshToken, sessionId, setSessionId, id, setId }) => {
  const [u, setU] = useState([]);

  // const size = useWindowSize();

  const [idMessage, setIdMessage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  //panel Sidebar
  const [sidebarPanel, setSidebarPanel] = useState(true);
  const [sidebarListChat, setSideBarListChat] = useState(true);
  const [sidebarProfile, setSideBarProfile] = useState(false);
  const [sidebarChangeEmail, setSidebarChangeEmail] = useState(false);
  const [sidebarChangePassword, setSidebarChangePassword] = useState(false);
  const [sidebarDeleteAccount, setSidebarChangeDeleteAccount] = useState(false);
  //panel sidebar outtools
  const [userOnline, setUserOnline] = useState([]);

  const [newMessage, setNewMessage] = useState([]);

  //panel Message
  const [messagePanel, setMessagePanel] = useState(false);
  const [messagePrivate, setMessagePrivate] = useState(false);
  const [messageCreate, setMessageCreate] = useState(false);
  const [messageGroup, setMessageGroup] = useState(false);
  //panel sidebar outtools
  const [listMessage, setListMessage] = useState([]);

  const { UsersProfile } = useSelector((state) => state.UsersProfile);

  const dispatch = useDispatch();
  const dispatchGetUsersProfile = async () => {
    await dispatch(getUsersProfile()).unwrap();
  };
  // console.log(userOnline);

  useEffect(() => {
    setIsLoading(true);
    dispatchGetUsersProfile();
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    socket.on("users", (e) => {
      setU(e);

      e.map((x) => {
        if (x.userID != id) {
          setNewMessage((value) => [...value, { sender: x.userID, count: 0 }]);
        }
        setIsLoading(false);

        if (x.connected == "true" && x.userID != id) {
          setUserOnline((value) => [...value, x.userID]);
          setIsLoading(false);
        }
      });
      // console.log(e)
    });

    return () => {
      socket.off("users");
    };
  }, [socket, u, userOnline]);

  useEffect(() => {
    socket.on("messagePrivateForward", ({ id, content, sender, receiver, created_on }) => {
      setU(
        u.map((item) => {
          if (item.userID == sender) {
            // Create a *new* object with changes
            return { ...item, messages: [...item.messages, { id, content, sender, receiver, created_on }] , messagesUnread: item.messagesUnread + 1 };
          } else {
            // No changes
            return item;
          }
        })
      );

      // setNewMessage({
      //   ...newMessage,
      //   sender: sender,
      //   count: newMessage.count+1,
      // })

      //   setNewMessage({
      //   ...newMessage,
      //   sender: sender,
      //   count: newMessage.count+1,
      // })

      //timpa
      // setNewMessage((value) => [...value, { sender: sender,
      //   count: newMessage.count+1 }]);

      // setNewMessage(
      //   newMessage.map((item) => {
      //     if (item.sender == sender) {
      //       // console.log("sender sama");
      //       // Create a *new* object with changes
      //       return { ...item, count: item.count + 1 };
      //     } else {
      //       // No changes
      //       return item;
      //     }
      //   })
      // );


    });

    return () => {
      socket.off("messagePrivateForward");
    };
  }, [socket, u, newMessage]);

  useEffect(() => {
    socket.on("user connected", (user) => {
      setUserOnline((value) => [...value, user.userID]);
    });

    return () => {
      socket.off("user connected");
    };
  }, [socket, userOnline]);

  useEffect(() => {
    socket.on("user disconnected", (id) => {
      // console.log(userOnline);
      setUserOnline(userOnline.filter((item) => item !== id));
    });

    return () => {};
  }, [socket, userOnline]);

  return (
    <Fragment>
      <PreLoader isLoading={isLoading} />

      <div className="container-xl container-lg container-md-fluid container-sm-fluid bg-white col-12 d-flex vh-100 rounded shadow ">
        <UsersChatSideBar
          //from homepage
          u={u}
          setU={setU}
          token={token}
          setToken={setToken}
          refreshToken={refreshToken}
          setRefreshToken={setRefreshToken}
          sessionId={sessionId}
          setSessionId={setSessionId}
          id={id}
          setId={setId}
          //sidebar panel
          sidebarPanel={sidebarPanel}
          setSidebarPanel={setSidebarPanel}
          sidebarListChat={sidebarListChat}
          setSideBarListChat={setSideBarListChat}
          sidebarProfile={sidebarProfile}
          setSideBarProfile={setSideBarProfile}
          sidebarChangeEmail={sidebarChangeEmail}
          setSidebarChangeEmail={setSidebarChangeEmail}
          sidebarChangePassword={sidebarChangePassword}
          setSidebarChangePassword={setSidebarChangePassword}
          sidebarDeleteAccount={sidebarDeleteAccount}
          setSidebarChangeDeleteAccount={setSidebarChangeDeleteAccount}
          //sidebar panel outtools
          userOnline={userOnline}
          setUserOnline={setUserOnline}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          UsersProfile={UsersProfile}
          dispatchGetUsersProfile={dispatchGetUsersProfile}
          //message panel
          messagePanel={messagePanel}
          setMessagePanel={setMessagePanel}
          messagePrivate={messagePrivate}
          setMessagePrivate={setMessagePrivate}
          messageCreate={messageCreate}
          setMessageCreate={setMessageCreate}
          messageGroup={messageGroup}
          setMessageGroup={setMessageGroup}
          //messagepanel outtools
          idMessage={idMessage}
          setIdMessage={setIdMessage}
          listMessage={listMessage}
          setListMessage={setListMessage}
        />
        <UsersChatMessage
          //from homepage
          u={u}
          setU={setU}
          token={token}
          setToken={setToken}
          refreshToken={refreshToken}
          setRefreshToken={setRefreshToken}
          sessionId={sessionId}
          setSessionId={setSessionId}
          id={id}
          setId={setId}
          //sidebar panel
          sidebarPanel={sidebarPanel}
          setSidebarPanel={setSidebarPanel}
          sidebarListChat={sidebarListChat}
          setSideBarListChat={setSideBarListChat}
          sidebarProfile={sidebarProfile}
          setSideBarProfile={setSideBarProfile}
          sidebarChangeEmail={sidebarChangeEmail}
          setSidebarChangeEmail={setSidebarChangeEmail}
          sidebarChangePassword={sidebarChangePassword}
          setSidebarChangePassword={setSidebarChangePassword}
          sidebarDeleteAccount={sidebarDeleteAccount}
          setSidebarChangeDeleteAccount={setSidebarChangeDeleteAccount}
          //sidebar panel outtools
          userOnline={userOnline}
          setUserOnline={setUserOnline}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          UsersProfile={UsersProfile}
          dispatchGetUsersProfile={dispatchGetUsersProfile}
          //message panel
          messagePanel={messagePanel}
          setMessagePanel={setMessagePanel}
          messagePrivate={messagePrivate}
          setMessagePrivate={setMessagePrivate}
          messageCreate={messageCreate}
          setMessageCreate={setMessageCreate}
          messageGroup={messageGroup}
          setMessageGroup={setMessageGroup}
          //messagepanel outtools
          idMessage={idMessage}
          setIdMessage={setIdMessage}
          listMessage={listMessage}
          setListMessage={setListMessage}
        />
      </div>
    </Fragment>
  );
};

export default UsersChat;
