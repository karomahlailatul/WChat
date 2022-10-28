import { useState, Fragment, useEffect } from "react";
import UsersChatSideBar from "../HomeChatPanelSideBar";
import UsersChatMessage from "../HomeChatPanelMessage";
import socket from "../../app/socket-io.client";
import { useDispatch } from "react-redux";
import { getUsersProfile } from "../../app/redux/Slice/UsersProfileSlice";
import PreLoader from "../PreLoader";

const UsersChat = ({ token, setToken, refreshToken, setRefreshToken, sessionId, setSessionId, id, setId, 
  title, 
  setTittle 
}) => {
  const [u, setU] = useState([]);
  const [g, setG] = useState([]);

  // const size = useWindowSize();
  const [idMessage, setIdMessage] = useState(null);
  const [idMessageGroup, setIdMessageGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //panel Sidebar
  const [sidebarPanel, setSidebarPanel] = useState(true);
  const [sidebarListChat, setSideBarListChat] = useState(true);
  const [sidebarListChatPrivate, setSideBarListChatPrivate] = useState(true);
  const [sidebarListChatGroup, setSideBarListChatGroup] = useState(false);
  const [sidebarProfile, setSideBarProfile] = useState(false);
  const [sidebarChangeEmail, setSidebarChangeEmail] = useState(false);
  const [sidebarChangePassword, setSidebarChangePassword] = useState(false);
  const [sidebarDeleteAccount, setSidebarChangeDeleteAccount] = useState(false);
  const [sidebarListChatSearch, setSidebarListChatSearch] = useState(false);
  const [sidebarListGroup, setSidebarListGroup] = useState(false);
  const [sidebarCreateGroup, setSidebarCreateGroup] = useState(false);
  const [sidebarEditGroup, setSidebarEditGroup] = useState(false);
  const [sidebarDetailsGroup, setSidebarDetailsGroup] = useState(false);

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
  const [listMessageGroup, setListMessageGroup] = useState([]);

  const [UsersProfile, setUsersProfile] = useState([]);

  const dispatch = useDispatch();
  const dispatchGetUsersProfile = async () => {
    await dispatch(getUsersProfile()).unwrap();
  };

  // GROUP AREA
  // list group
  useEffect(() => {
    socket.on("listGroup", (x) => {
      setG(x);
    });
    return () => {
      socket.off("listGroup");
    };
  }, [socket, g]);

  // received group private message
  useEffect(() => {
    socket.on("messageGroupPrivateForward", ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }) => {
      setG(
        g.map((item) => {
          if (item.id == group_chat_id) {
            // Create a *new* object with changes
            return {
              ...item,
              message_group: [...item.message_group, { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
              message_group_unread: item.message_group_unread + 1,
            };
          } else {
            // No changes
            return item;
          }
        })
      );
    });
    
    return () => {
      socket.off("messageGroupPrivateForward");
    };
  }, [socket, g]);

  // received group member boardcast join
  useEffect(() => {
    socket.on("joinGroupForward", ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }) => {
      setG(
        g.map((item) => {
          if (item.id == group_chat_id) {
            // Create a *new* object with changes
            return {
              ...item,
              group_member: [...item.group_member, sender],
              message_group: [...item.message_group, { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
              message_group_unread: item.message_group_unread + 1,
            };
          } else {
            // No changes
            return item;
          }
        })
      );
    });

    return () => {
      socket.off("joinGroupForward");
    };
  }, [socket, g]);

  // received group member boardcast leave
  useEffect(() => {
    socket.on("leaveGroupForward", ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }) => {
      setG(
        g.map((item) => {
          if (item.id == group_chat_id) {
            const listMemberUpdate = [];
            item.group_member.map((item_member) => {
              if (item_member != sender) {
                listMemberUpdate.push(item_member);
              }
            });
            // Create a *new* object with changes
            return {
              ...item,
              group_member: listMemberUpdate,
              message_group: [...item.message_group, { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
              message_group_unread: item.message_group_unread + 1,
            };
          } else {
            // No changes
            return item;
          }
        })
      );
    });

    return () => {
      socket.off("leaveGroupForward");
    };
  }, [socket, g]);

  // received all broadcast new group created
  useEffect(() => {
    socket.on("createGroupForward", ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on, owner_id, group_member, group_name, group_logo }) => {
      setG((g) => [
        ...g,
        {
          id: group_chat_id,
          owner_id: owner_id,
          email: email,
          group_logo: group_logo,
          group_member: group_member,
          group_name: group_name,
          message_group: [{ id, content_type, content, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
          message_group_unread: 0,
          created_on: created_on,
          name: name,
          username: username,
          phone: phone,
          status: status,
          picture: picture,
          users_created_on: users_created_on,
        },
      ]);
    });

    return () => {
      socket.off("createGroupForward");
    };
  }, [socket, g]);

  // received all broadcast new group updated
  useEffect(() => {
    socket.on("updatedGroupForward", ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on, owner_id, group_member, group_name, group_logo }) => {
       setG(
        g.map((item) => {
          if (item.id == group_chat_id) {
            // Create a *new* object with changes
            return {
              ...item,
              message_group: [...item.message_group, { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
              message_group_unread: item.message_group_unread + 1,
              id: group_chat_id,
              owner_id: owner_id,
              email: email,
              group_logo: group_logo,
              group_member: group_member,
              group_name: group_name,
              created_on: created_on,
              name: name,
              username: username,
              phone: phone,
              status: status,
              picture: picture,
              users_created_on: users_created_on,
            };
          } else {
            // No changes
            return item;
          }
        })
      );
    });

    return () => {
      socket.off("updatedGroupForward");
    };
  }, [socket, g]);

  // received all broadcast new group member updated
  useEffect(() => {
    socket.on("leaveGroupAdminForward", ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on, dataGroupMemberListForward }) => {
      setG(
        g.map((item) => {
          if (item.id == group_chat_id) {
            // Create a *new* object with changes
            return {
              ...item,
              message_group: [...item.message_group, { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
              message_group_unread: item.message_group_unread + 1,
              group_member: [dataGroupMemberListForward],
            };
          } else {
            // No changes
            return item;
          }
        })
      );
    });

    return () => {
      socket.off("leaveGroupAdminForward");
    };
  }, [socket, g]);

 // received all broadcast remove group member 
 useEffect(() => {
  socket.on("removeGroupForward", ({ group_chat_id }) => {
    setG(g.filter((item) => item.id != group_chat_id));
  });
  return () => {
    socket.off("removeGroupForward");
  };
}, [socket, g]);


  //USER AREA
  // list users
  useEffect(() => {
    socket.on("listUsers", (e) => {
      setU(e);
      e.map((x) => {
        if (x.userID == id) {
          setUsersProfile(x);
        }
        if (x.connected == "true" && x.userID != id) {
          setUserOnline((value) => [...value, x.userID]);
          setIsLoading(false);
        }
      });
    });

    return () => {
      socket.off("listUsers");
    };
  }, [socket, u, userOnline]);

  // received private message
  useEffect(() => {
    socket.on("messagePrivateForward", ({ id, content, sender, receiver, created_on }) => {
      setU(
        u.map((item) => {
          if (item.userID == sender) {
            // Create a *new* object with changes
            return { ...item, messages: [...item.messages, { id, content, sender, receiver, created_on }], messagesUnread: item.messagesUnread + 1 };
          } else {
            // No changes
            return item;
          }
        })
      );
    });

    return () => {
      socket.off("messagePrivateForward");
    };
  }, [socket, u, newMessage]);

  //new people connected
  useEffect(() => {
    socket.on("user connected", (user) => {
      setUserOnline((value) => [...value, user.userID]);
    });

    return () => {
      socket.off("user connected");
    };
  }, [socket, userOnline]);

  //new people disconnected
  useEffect(() => {
    socket.on("user disconnected", (id) => {
      setUserOnline(userOnline.filter((item) => item !== id));
    });

    return () => {};
  }, [socket, userOnline]);

  //new people updated profile
  useEffect(() => {
    socket.on("updatedUsersForward", ({ id, email, name, username, phone, status, picture }) => {
      // setUserOnline((value) => [...value, user.userID]);
      setU(
        u.map((item) => {
          if (item.id == id) {
            // Create a *new* object with changes
            return {
              ...item,
              name: name == undefined || name == null ? null : name,
              email: email == undefined || email == null ? null : email,
              username: username == undefined || username == null ? null : username,
              phone: phone == undefined || phone == null ? null : phone,
              status: status == undefined || status == null ? null : status,
              picture: picture == undefined || picture == null ? null : picture,
            };
          } else {
            // No changes
            return item;
          }
        })
      );
    });

    return () => {
      socket.off("updatedUsersForward");
    };
  }, [socket, u]);


  //count tittle 
  useEffect(() => {
    let countMessage = 0
    g.map((item) => countMessage = countMessage + item.message_group_unread )
    u.map((item) => countMessage = countMessage + item.messagesUnread )
    setTittle(countMessage)
  }, [u,g])
  
  return (
    <Fragment>
      <PreLoader isLoading={isLoading} />

      <div className="container-chat container-xl container-lg container-md-fluid container-sm-fluid bg-white col-12 d-flex rounded shadow ">
        <UsersChatSideBar
          //from homepage
          u={u}
          setU={setU}
          g={g}
          setG={setG}
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
          //sidebar panel component
          //sidebar chat
          sidebarListChat={sidebarListChat}
          setSideBarListChat={setSideBarListChat}
          sidebarListChatPrivate={sidebarListChatPrivate}
          setSideBarListChatPrivate={setSideBarListChatPrivate}
          sidebarListChatGroup={sidebarListChatGroup}
          setSideBarListChatGroup={setSideBarListChatGroup}
          //sidebar profile
          sidebarProfile={sidebarProfile}
          setSideBarProfile={setSideBarProfile}
          sidebarChangeEmail={sidebarChangeEmail}
          setSidebarChangeEmail={setSidebarChangeEmail}
          sidebarChangePassword={sidebarChangePassword}
          setSidebarChangePassword={setSidebarChangePassword}
          sidebarDeleteAccount={sidebarDeleteAccount}
          setSidebarChangeDeleteAccount={setSidebarChangeDeleteAccount}
          sidebarListChatSearch={sidebarListChatSearch}
          setSidebarListChatSearch={setSidebarListChatSearch}
          sidebarListGroup={sidebarListGroup}
          setSidebarListGroup={setSidebarListGroup}
          sidebarCreateGroup={sidebarCreateGroup}
          setSidebarCreateGroup={setSidebarCreateGroup}
          sidebarEditGroup={sidebarEditGroup}
          setSidebarEditGroup={setSidebarEditGroup}
          sidebarDetailsGroup={sidebarDetailsGroup}
          setSidebarDetailsGroup={setSidebarDetailsGroup}
          //sidebar panel outtools
          userOnline={userOnline}
          setUserOnline={setUserOnline}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          UsersProfile={UsersProfile}
          setUsersProfile={setUsersProfile}
          dispatchGetUsersProfile={dispatchGetUsersProfile}
          //message panel
          messagePanel={messagePanel}
          setMessagePanel={setMessagePanel}
          //message panel component
          messagePrivate={messagePrivate}
          setMessagePrivate={setMessagePrivate}
          messageCreate={messageCreate}
          setMessageCreate={setMessageCreate}
          messageGroup={messageGroup}
          setMessageGroup={setMessageGroup}
          //message outtools
          idMessage={idMessage}
          setIdMessage={setIdMessage}
          idMessageGroup={idMessageGroup}
          setIdMessageGroup={setIdMessageGroup}
          listMessage={listMessage}
          setListMessage={setListMessage}
          listMessageGroup={listMessageGroup}
          setListMessageGroup={setListMessageGroup}
        />
        <UsersChatMessage
          //from homepage
          u={u}
          setU={setU}
          g={g}
          setG={setG}
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
          //sidebar panel component
          //sidebar chat
          sidebarListChat={sidebarListChat}
          setSideBarListChat={setSideBarListChat}
          sidebarListChatPrivate={sidebarListChatPrivate}
          setSideBarListChatPrivate={setSideBarListChatPrivate}
          sidebarListChatGroup={sidebarListChatGroup}
          setSideBarListChatGroup={setSideBarListChatGroup}
          //sidebar profile
          sidebarProfile={sidebarProfile}
          setSideBarProfile={setSideBarProfile}
          sidebarChangeEmail={sidebarChangeEmail}
          setSidebarChangeEmail={setSidebarChangeEmail}
          sidebarChangePassword={sidebarChangePassword}
          setSidebarChangePassword={setSidebarChangePassword}
          sidebarDeleteAccount={sidebarDeleteAccount}
          setSidebarChangeDeleteAccount={setSidebarChangeDeleteAccount}
          sidebarListChatSearch={sidebarListChatSearch}
          setSidebarListChatSearch={setSidebarListChatSearch}
          sidebarListGroup={sidebarListGroup}
          setSidebarListGroup={setSidebarListGroup}
          sidebarCreateGroup={sidebarCreateGroup}
          setSidebarCreateGroup={setSidebarCreateGroup}
          sidebarEditGroup={sidebarEditGroup}
          setSidebarEditGroup={setSidebarEditGroup}
          sidebarDetailsGroup={sidebarDetailsGroup}
          setSidebarDetailsGroup={setSidebarDetailsGroup}
          //sidebar panel outtools
          userOnline={userOnline}
          setUserOnline={setUserOnline}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          UsersProfile={UsersProfile}
          setUsersProfile={setUsersProfile}
          dispatchGetUsersProfile={dispatchGetUsersProfile}
          //message panel
          messagePanel={messagePanel}
          setMessagePanel={setMessagePanel}
          //message panel component
          messagePrivate={messagePrivate}
          setMessagePrivate={setMessagePrivate}
          messageCreate={messageCreate}
          setMessageCreate={setMessageCreate}
          messageGroup={messageGroup}
          setMessageGroup={setMessageGroup}
          //message outtools
          idMessage={idMessage}
          setIdMessage={setIdMessage}
          idMessageGroup={idMessageGroup}
          setIdMessageGroup={setIdMessageGroup}
          listMessage={listMessage}
          setListMessage={setListMessage}
          listMessageGroup={listMessageGroup}
          setListMessageGroup={setListMessageGroup}
        />
      </div>
    </Fragment>
  );
};

export default UsersChat;
