import { useState, useEffect, Fragment, useRef } from "react";
import useWindowSize from "../WindowsSize";
import socket from "../../app/socket-io.client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Desktop, Mobile } from "../Responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteMessageDeleteAllPrivateMessage } from "../../app/redux/Slice/MessageDeleteAllPrivateMessage";

const HomeChatPanelMessage = ({
  u,
  setU,
  g,
  setG,
  token,
  // setToken,
  refreshToken,
  // setRefreshToken,
  sessionId,
  // setSessionId,
  id,
  // setId,

  //sidebar panel
  sidebarPanel,
  setSidebarPanel,

  //sidebar panel component
  // sidebarListChat,
  setSideBarListChat,
  // sidebarListChatPrivate,
  setSideBarListChatPrivate,
  // sidebarListChatGroup,
  setSideBarListChatGroup,

  // sidebarProfile,
  setSideBarProfile,
  // sidebarChangeEmail,
  // setSidebarChangeEmail,
  // sidebarChangePassword,
  // setSidebarChangePassword,
  // sidebarDeleteAccount,
  // setSidebarChangeDeleteAccount,
  // sidebarListChatSearch,
  setSidebarListChatSearch,
  // sidebarListGroup,
  // setSidebarListGroup,
  // sidebarCreateGroup,
  setSidebarCreateGroup,
  // sidebarEditGroup,
  // setSidebarEditGroup,
  // sidebarDetailsGroup,
  setSidebarDetailsGroup,

  //sidebar panel outtools
  userOnline,
  // setUserOnline,
  // newMessage,
  // setNewMessage,
  // newMessageGroup,
  // setNewMessageGroup,
  UsersProfile,
  // setUsersProfile,
  // dispatchGetUsersProfile,

  //message panel
  messagePanel,
  setMessagePanel,

  //message panel component
  messagePrivate,
  setMessagePrivate,
  // messageCreate,
  // setMessageCreate,
  messageGroup,
  setMessageGroup,

  //message outtools
  idMessage,
  setIdMessage,
  // idMessageGroup,
  // setIdMessageGroup,
  // listMessage,
  // setListMessage,
  // listMessageGroup,
  // setListMessageGroup,
}) => {
  const size = useWindowSize();

  const [dataUser, setDataUser] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [content, setContent] = useState("");
  const [enabledSend, setEnabledSend] = useState(false);

  const messageEndRef = useRef(null);
  const messageEndRefGroup = useRef(null);

  const dispatch = useDispatch();

  const sender = id;
  const receiver = idMessage;
  const group_chat_id = idMessage;

  // delete user message
  const handleDeleteAllPrivateMessage = () => {
    dispatch(deleteMessageDeleteAllPrivateMessage({ sender, receiver }))
      .unwrap()
      .then((item) => {
        if (item.statusCode === 200) {
          // setListMessage([]);
          setMessagePanel(false);
          setSidebarPanel(true);
          setU(
            u.map((item) => {
              if (item.userID == receiver) {
                // Create a *new* object with changes
                return { ...item, messages: [], messagesUnread: 0 };
              } else {
                // No changes
                return item;
              }
            })
          );
        }
      });
  };

  // send private message
  const handleSend = async (e) => {
    await e.preventDefault();
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const created_on = new Date().toISOString();
    socket.emit("messagePrivate", { id, content, sender, receiver, created_on });

    setU(
      u.map((item) => {
        if (item.userID == receiver) {
          // Create a *new* object with changes
          return { ...item, messages: [...item.messages, { id, content, sender, receiver, created_on }] };
        } else {
          // No changes
          return item;
        }
      })
    );

    setContent("");
    document.getElementById("form-chat-message").reset();
    if (document.getElementById("input-search")) {
      document.getElementById("input-search").value = "";
      setSidebarListChatSearch(false);
    }
  };

  // join group
  const joinGroup = async () => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const created_on = new Date().toISOString();

    const users_created_on = UsersProfile.created_on;
    const { email, name, username, phone, status, picture } = UsersProfile;
    const content_type = "mb";
    const content = `${username == null || username == undefined ? email : username} has been joined`;

    socket.emit("joinGroup", { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on });

    setG(
      g.map((item) => {
        if (item.id == group_chat_id) {
          // Create a *new* object with changes
          return { ...item, group_member: [...item.group_member, sender], message_group: [...item.message_group, { id, content, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }] };
        } else {
          // No changes
          return item;
        }
      })
    );

    if (document.getElementById("input-search")) {
      await setSidebarListChatSearch(false);
      document.getElementById("input-search").value = "";
    }
    //panel list chat
    await setSideBarListChat(true);
    await setSideBarListChatPrivate(false);
    await setSideBarListChatGroup(true);
    await setSidebarListChatSearch(false);
    //panel profile
    await setSideBarProfile(false);
    //panel group
    await setSidebarCreateGroup(false);
    await setSidebarDetailsGroup(false);
    if (size.width >= 992) {
      document.getElementById("label-group-chat").click();
    }
  };

  // leave group
  const leaveGroup = async () => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const created_on = new Date().toISOString();

    const users_created_on = UsersProfile.created_on;
    const { email, name, username, phone, status, picture } = UsersProfile;
    const content_type = "mb";
    const content = `${username == null || username == undefined ? email : username} out`;

    socket.emit("leaveGroup", { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on });

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
          return { ...item, group_member: listMemberUpdate, message_group: [...item.message_group, { id, content, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }] };
        } else {
          // No changes
          return item;
        }
      })
    );

    setMessagePanel(false);
    setSidebarPanel(true);
    //panel list chat
    await setSideBarListChat(true);
    await setSideBarListChatPrivate(false);
    await setSideBarListChatGroup(true);
    await setSidebarListChatSearch(false);
    //panel profile
    await setSideBarProfile(false);
    //panel group
    await setSidebarCreateGroup(false);
    await setSidebarDetailsGroup(false);
    if (size.width >= 992) {
      document.getElementById("label-group-chat").click();
    }
  };

  // send group message
  const handleSendGroup = async (e) => {
    await e.preventDefault();
    const users_created_on = UsersProfile.created_on;
    const { email, name, username, phone, status, picture } = UsersProfile;
    const content_type = "ma";
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const created_on = new Date().toISOString();
    socket.emit("messageGroupPrivate", { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on });

    setG(
      g.map((item) => {
        if (item.id == receiver) {
          // Create a *new* object with changes
          return { ...item, message_group: [...item.message_group, { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }] };
        } else {
          // No changes
          return item;
        }
      })
    );

    setContent("");
    document.getElementById("form-chat-message").reset();
    if (document.getElementById("input-search")) {
      document.getElementById("input-search").value = "";
      setSidebarListChatSearch(false);
    }
  };

  // filter group or message
  useEffect(() => {
    if (messagePrivate) {
      setDataUser(u.filter((e) => e.userID == idMessage)[0]);
    }
    if (messageGroup) {
      setDataGroup(g.filter((e) => e.id == idMessage)[0]);
    }

    return () => {};
  }, [dispatch, socket, u, g, token, refreshToken, sessionId, id, idMessage, setIdMessage, messagePanel, setMessagePanel, dataUser, dataGroup]);

  // set ref last private message
  const actionMessageEndRef = async () => {
    await messageEndRef?.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  };
  useEffect(() => {
    actionMessageEndRef();
  }, [dataUser, u]);

  // set ref last group message
  const actionMessageEndRefGroup = async () => {
    await messageEndRefGroup?.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  };
  useEffect(() => {
    actionMessageEndRefGroup();
  }, [dataGroup, g]);

  // if windows width set default showing panel
  useEffect(() => {
    if (size.width >= 992 && !sidebarPanel) {
      setSidebarPanel(true);
    } else if (size.width <= 992 && messagePanel) {
      setSidebarPanel(true);
      setMessagePanel(false);
    }
  }, [size]);

  // regex handle form send message
  var textarea = document.getElementById("text-area-message");
  useEffect(() => {
    const RegexSpace = /[ ]/;
    // eslint-disable-next-line no-useless-escape
    const RegexChar = /^\w[a-zA-Z0-9_\-\.[$&+,:;=?@#|'<>.^*()%!-~{}]*$/;
    const contentOnlyChar = content.replace(/\s/g, "");

    if (content.length != 0) {
      if (RegexSpace.test(content) && RegexChar.test(contentOnlyChar)) {
        setEnabledSend(true);
      } else if (!RegexSpace.test(content) && RegexChar.test(contentOnlyChar)) {
        setEnabledSend(true);
      }
    }

    if (content.length == 0) {
      setEnabledSend(false);
    }
  }, [content]);
  useEffect(() => {
    if (content.length != 0 && messagePanel == true) {
      var limitRows = 3;
      var messageLastScrollHeight = textarea?.scrollHeight;

      textarea.oninput = function () {
        var rows = parseInt(textarea.getAttribute("rows"));
        // If we don't decrease the amount of rows, the scrollHeight would show the scrollHeight for all the rows
        // even if there is no text.
        textarea.setAttribute("rows", "2");

        if (rows < limitRows && textarea?.scrollHeight > messageLastScrollHeight) {
          rows++;
        }
        if (rows > 1 && textarea?.scrollHeight < messageLastScrollHeight) {
          rows--;
        }

        messageLastScrollHeight = textarea?.scrollHeight;
        textarea.setAttribute("rows", rows);
      };
    }
    if (content.length == 0) {
      textarea?.setAttribute("rows", "2");
    }
  }, [textarea, content, messagePanel]);

  //check id message if null notting show
  useEffect(() => {
    if (messagePanel) {
      if (dataGroup == null || dataGroup == undefined || dataGroup == "") {
        setMessagePanel(false);
      }
    }
  }, [dataGroup]);

  


  return (
    <Fragment>
      {messagePanel == true ? (
        <Fragment>
          {messagePrivate ? (
            <Fragment>
              <Desktop>
                <div className="col-8 border-start container-fluid py-3  ">
                  <div className="row vh-100 ">
                    <div className="col-12 card border-0 ">
                      <div className="bg-info col-12 d-flex py-3 px-3 rounded shadow">
                        <div className="col-xl-1 col-lg-1 d-flex justify-content-center  img-bar-sidebar" data-toggle="modal" data-target="#view_info">
                          <Image src={dataUser?.picture == null ? "/assets/icons/ico-user.svg" : dataUser?.picture} width="50px" height="50px" className="img-preview " alt="" />

                          {userOnline.some((value) => value == idMessage) ? (
                            <Fragment>
                              <span className="icon-online" />
                            </Fragment>
                          ) : (
                            <Fragment>
                              <span className="icon-offline" />
                            </Fragment>
                          )}
                        </div>
                        <div className="col-xl-10 col-lg-10 ps-2 chat-about d-grid align-items-center  text-light">
                          <h6 className="my-0 text-truncate fw-bold">
                            {dataUser?.name == null || dataUser?.name == undefined ? (dataUser?.username == null || dataUser?.username == undefined ? dataUser?.email : dataUser?.username) : dataUser?.name}
                          </h6>
                          <span>
                            <small> {dataUser?.status == null ? "No Status" : dataUser.status}</small>
                          </span>
                        </div>
                        <div className="col-xl-1 col-lg-1 dropdown  d-flex justify-content-start">
                          <a className="btn btn-outline-info dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon="fa-solid fa-list" />
                          </a>
                          <ul className="dropdown-menu text-grey dropdown-menu-end mt-3">
                            <li>
                              <a className="dropdown-item" onClick={handleDeleteAllPrivateMessage}>
                                <FontAwesomeIcon icon="fa-solid fa-trash" className="me-2" /> Clear All Message
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 chat-history py-2 ">
                      <div id="chat-history-panel" className="chat-history-panel container h-100 w-100 ">
                        {dataUser?.messages?.map((item, index) =>
                          item?.sender == id ? (
                            <Fragment key={index}>
                              <div className="ms-4 my-2 text-light d-flex justify-content-end">
                                <div className="  bg-info rounded text-break text-start">
                                  <span className="d-flex ms-2 me-3 ">{item?.content}</span>
                                  <span className="d-flex mx-1 justify-content-end time-chat  my-auto">
                                    {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                  </span>
                                </div>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment key={index}>
                              <div className="me-4 my-2 text-light d-flex justify-content-start ">
                                <div className="bg-info rounded text-break text-end">
                                  <span className="d-flex ms-2 me-3 ">{item?.content}</span>
                                  <span className="d-flex mx-1 justify-content-end time-chat  my-auto">
                                    {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                  </span>
                                </div>
                              </div>
                            </Fragment>
                          )
                        )}
                        <div ref={messageEndRef} />
                      </div>
                    </div>
                    <form id="form-chat-message" onSubmit={(e) => handleSend(e)}>
                      <div className="col-12 align-self-end d-flex ">
                        <textarea
                          id="text-area-message"
                          className="form-control  text-area-message text-secondary side-scroll w-100"
                          placeholder=""
                          rows={2}
                          onChange={(e) => {
                            setContent(e.target.value);
                          }}
                        />
                        <button type="submit" className="btn btn-info fw-bold text-light icon-send px-5" disabled={enabledSend === true ? false : true}>
                          <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Desktop>
              <Mobile>
                <div className="col-12 py-3">
                  <div className="row vh-100 ">
                    <div className="col-12 card border-0 ">
                      <div className="col-12 bg-info d-flex py-3  shadow d-flex align-items-center justify-content-center rounded ">
                        <div
                          className="col-1 d-flex justify-content-center align-items-center cursor-pointer"
                          onClick={() => {
                            setSidebarPanel(true);
                            setMessagePanel(false);
                            setMessagePrivate(false);
                            setMessageGroup(false);
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-chevron-left" className="ms-2 text-light" />
                        </div>

                        <div className="col-xl-1 col-lg-1 d-flex justify-content-center  img-bar-sidebar" data-toggle="modal" data-target="#view_info">
                          <Image src={dataUser?.picture == null ? "/assets/icons/ico-user.svg" : dataUser?.picture} width="50px" height="50px" className="img-preview " alt="" />

                          {userOnline.some((value) => value == idMessage) ? (
                            <Fragment>
                              <span className="icon-online" />
                            </Fragment>
                          ) : (
                            <Fragment>
                              <span className="icon-offline" />
                            </Fragment>
                          )}
                        </div>

                        <div className="col-9 ps-2 chat-about d-grid align-items-center">
                          <h6 className="my-0 text-truncate text-light fw-bold">
                            {dataUser?.name == null || dataUser?.name == undefined ? (dataUser?.username == null || dataUser?.username == undefined ? dataUser?.email : dataUser?.username) : dataUser?.name}
                          </h6>
                        </div>
                        <div className="col-1 dropdown d-flex justify-content-center">
                          <a className="btn btn-outline-info dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon="fa-solid fa-list" />
                          </a>
                          <ul className="dropdown-menu text-grey dropdown-menu-end mt-3">
                            <li>
                              <a className="dropdown-item" onClick={handleDeleteAllPrivateMessage}>
                                <FontAwesomeIcon icon="fa-solid fa-trash" className="me-2" /> Clear All Message
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 chat-history py-2">
                      <div id="chat-history-panel" className="container-fluid chat-history-panel h-100 w-100">
                        {dataUser?.messages?.map((item, index) =>
                          item?.sender == id ? (
                            <Fragment key={index}>
                              <div className="ms-4 my-2 text-light d-flex justify-content-end">
                                <div className="  bg-info rounded text-break text-start">
                                  <span className="d-flex ms-2 me-3 ">{item?.content}</span>
                                  <span className="d-flex mx-1 justify-content-end time-chat  my-auto">
                                    {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                  </span>
                                </div>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment key={index}>
                              <div className="me-4 my-2 text-light d-flex justify-content-start ">
                                <div className="bg-info rounded text-break text-end">
                                  <span className="d-flex ms-2 me-3 ">{item?.content}</span>
                                  <span className="d-flex mx-1 justify-content-end time-chat  my-auto">
                                    {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                  </span>
                                </div>
                              </div>
                            </Fragment>
                          )
                        )}
                        <div ref={messageEndRef} />
                      </div>
                    </div>
                    <form id="form-chat-message" onSubmit={(e) => handleSend(e)}>
                      <div className="col-12 align-self-end d-flex ">
                        <textarea
                          id="text-area-message"
                          className="form-control  text-area-message text-secondary side-scroll w-100"
                          placeholder=""
                          rows={2}
                          onChange={(e) => {
                            setContent(e.target.value);
                          }}
                        />
                        <button type="submit" className="btn btn-info fw-bold text-light icon-send px-5" disabled={enabledSend === true ? false : true}>
                          <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Mobile>
            </Fragment>
          ) : null}

          {messageGroup ? (
            <Fragment>
              <Desktop>
                <div className="col-8 border-start container-fluid py-3  ">
                  <div className="row vh-100 ">
                    <div className="col-12 card border-0 ">
                      <div className="bg-info col-12 d-flex py-3 px-3 rounded shadow">
                        <div className="col-xl-1 col-lg-1 d-flex justify-content-center  img-bar-sidebar" data-toggle="modal" data-target="#view_info">
                          <Image src={dataGroup?.group_logo == null ? "/assets/icons/ico-group.svg" : dataGroup?.group_logo} width="50px" height="50px" className="img-preview " alt="" />
                        </div>
                        <div className="col-xl-10 col-lg-10 ps-2 chat-about d-grid align-items-center  text-light">
                          <h6 className="my-0 text-truncate fw-bold">{dataGroup?.group_name == null ? dataGroup?.id : dataGroup?.group_name}</h6>
                          <span>
                            <small>Total Member : {dataGroup?.group_member?.length}</small>
                          </span>
                        </div>
                        {dataGroup?.group_member?.includes(id) ? (
                          <div className="col-xl-1 col-lg-1 dropdown  d-flex justify-content-start">
                            <a className="btn btn-outline-info dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <FontAwesomeIcon icon="fa-solid fa-list" />
                            </a>
                            <ul className="dropdown-menu text-grey dropdown-menu-end mt-3">
                              {dataGroup?.owner_id == id ? (
                                <Fragment>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      onClick={async () => {
                                        //panel list chat
                                        await setSideBarListChat(false);
                                        await setSideBarListChatPrivate(false);
                                        await setSideBarListChatGroup(false);
                                        await setSidebarListChatSearch(false);
                                        //panel profile
                                        await setSideBarProfile(false);
                                        //panel group
                                        await setSidebarCreateGroup(false);
                                        await setSidebarDetailsGroup(true);
                                        // if (size.width >= 992) {
                                        //   document.getElementById("label-group-chat").click();
                                        // }
                                      }}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-users-gear" className="col-1 me-2" />
                                      <span className="col-11"> Setting Group</span>
                                    </a>
                                  </li>

                                  <li>
                                    <a
                                      className="dropdown-item"
                                      // onClick={handleDeleteAllPrivateMessage}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-trash" className="col-1 me-2" />
                                      <span className="col-11"> Clear All Message Group</span>
                                    </a>
                                  </li>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      onClick={async () => {
                                        //panel list chat
                                        await setSideBarListChat(false);
                                        await setSideBarListChatPrivate(false);
                                        await setSideBarListChatGroup(false);
                                        await setSidebarListChatSearch(false);
                                        //panel profile
                                        await setSideBarProfile(false);
                                        //panel group
                                        await setSidebarCreateGroup(false);
                                        await setSidebarDetailsGroup(true);
                                        // if (size.width >= 992) {
                                        //   document.getElementById("label-group-chat").click();
                                        // }
                                      }}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-users-rectangle" className="col-1 me-2" />
                                      <span className="col-11">Details Group</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" onClick={leaveGroup}>
                                      <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" className="col-1 me-2" />
                                      <span className="col-11">Leave Group</span>
                                    </a>
                                  </li>
                                </Fragment>
                              )}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-12 chat-history py-2 ">
                      <div id="chat-history-panel" className="chat-history-panel container-fluid h-100 w-100 ">
                        {dataGroup?.group_member?.includes(id)
                          ? dataGroup?.message_group?.map((item) =>
                              item?.sender == id ? (
                                <Fragment key={item.id}>
                                  {item.content_type == "ma" ? (
                                    <Fragment>
                                      <div className="ms-4 my-2 text-light d-flex justify-content-end">
                                        <div className="d-grid bg-info rounded text-break">
                                          {u.map((user) =>
                                            item?.sender == user.id ? (
                                              <Fragment key={user.id}>
                                                <div className="d-flex px-2  rounded bg-primary bg-opacity-50 ">
                                                  <Image src={user?.picture == null ? "/assets/icons/ico-user.svg" : user?.picture} width="12px" height="12px" className="img-preview my-auto py-1" alt="" />
                                                  <span className="ms-1  fw-bold  my-auto title-chat">
                                                    {user?.name == null || user?.name == undefined ? (user?.username == null || user?.username == undefined ? user?.email : user?.username) : user?.name}
                                                  </span>
                                                </div>
                                                <span className="d-flex ms-2 me-3 content-chat">{item?.content}</span>
                                                <span className="d-flex mx-1 justify-content-end my-auto time-chat ">
                                                  {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                                </span>
                                              </Fragment>
                                            ) : null
                                          )}
                                        </div>
                                      </div>
                                    </Fragment>
                                  ) : (
                                    <div className="col-12 justify-content-center d-flex my-2 py-0 text-center text-dark ">
                                      <hr className="w-25" />
                                      <span className="mx-2 d-flex my-auto text-secondary">
                                        {u.map((user) =>
                                          item?.sender == user.id ? (
                                            <Fragment key={user.id}>{item?.content.includes(UsersProfile.username || UsersProfile.email) ? `You're ${item?.content?.split(UsersProfile.username || UsersProfile.email)[1]}` : item?.content}</Fragment>
                                          ) : null
                                        )}
                                      </span>
                                      <hr className="w-25" />
                                    </div>
                                  )}
                                </Fragment>
                              ) : (
                                <Fragment key={item.id}>
                                  {item.content_type == "ma" ? (
                                    <div className="me-4 my-2 text-light d-flex justify-content-start">
                                      <div className="d-grid bg-info rounded text-break">
                                        {u.map((user) =>
                                          item?.sender == user.id ? (
                                            <Fragment key={user.id}>
                                              <div className="d-flex px-2  rounded bg-primary bg-opacity-50 ">
                                                <Image src={user?.picture == null ? "/assets/icons/ico-user.svg" : user?.picture} width="12px" height="12px" className="img-preview my-auto py-1" alt="" />
                                                <span className="ms-1  fw-bold  my-auto title-chat">
                                                  {user?.name == null || user?.name == undefined ? (user?.username == null || user?.username == undefined ? user?.email : user?.username) : user?.name}
                                                </span>
                                              </div>
                                              <span className="d-flex ms-2 me-3 content-chat">{item?.content}</span>
                                              <span className="d-flex mx-1 justify-content-end my-auto time-chat ">
                                                {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                              </span>
                                            </Fragment>
                                          ) : null
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="col-12 justify-content-center d-flex my-2 py-0 text-center text-dark ">
                                      <hr className="w-25" />
                                      <span className="mx-2 d-flex my-auto text-secondary">
                                        {u.map((user) =>
                                          item?.sender == user.id ? (
                                            <Fragment key={user.id}>
                                              {item?.content.includes(UsersProfile.username || UsersProfile.email)
                                                ? item?.content.includes("kick out")
                                                  ? `${item?.content?.split(UsersProfile.username || UsersProfile.email)[0]} you're `
                                                  : `You're ${item?.content?.split(UsersProfile.username || UsersProfile.email)[1]}`
                                                : item?.content}
                                            </Fragment>
                                          ) : null
                                        )}
                                      </span>
                                      <hr className="w-25" />
                                    </div>
                                  )}
                                </Fragment>
                              )
                            )
                          : null}
                        <div ref={messageEndRefGroup} />
                      </div>
                    </div>

                    {dataGroup?.group_member?.includes(id) ? (
                      <form id="form-chat-message" onSubmit={(e) => handleSendGroup(e)}>
                        <div className="col-12 align-self-end d-flex ">
                          <textarea
                            id="text-area-message"
                            className="form-control  text-area-message text-secondary side-scroll w-100"
                            placeholder=""
                            rows={2}
                            onChange={(e) => {
                              setContent(e.target.value);
                            }}
                          />
                          <button type="submit" className="btn btn-info fw-bold text-light icon-send px-5" disabled={enabledSend === true ? false : true}>
                            <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="col-12 align-self-end d-grid ">
                        <button
                          type="submit"
                          className="btn btn-info fw-bold text-light icon-send px-5"
                          onClick={() => {
                            joinGroup();
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-user-plus" className="me-2" /> Join Group
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Desktop>
              <Mobile>
                <div className="col-12  py-3  ">
                  <div className="row vh-100 ">
                    <div className="col-12 card border-0 ">
                      <div className="bg-info col-12 d-flex py-3 px-3 rounded shadow">
                        <div
                          className="col-1 d-flex justify-content-center align-items-center cursor-pointer"
                          onClick={async () => {
                            await setSidebarPanel(true);
                            await setSideBarListChat(true);
                            await setSideBarListChatPrivate(false);
                            await setSideBarListChatGroup(true);
                            await setSidebarListChatSearch(false);
                            await setMessagePanel(false);
                            await setMessagePrivate(false);
                            await setMessageGroup(false);
                            document.getElementById("label-group-chat").click();
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-chevron-left" className="ms-2 text-light" />
                        </div>
                        <div className="col-1 d-flex justify-content-center  img-bar-sidebar" data-toggle="modal" data-target="#view_info">
                          <Image src={dataGroup?.group_logo == null ? "/assets/icons/ico-group.svg" : dataGroup?.group_logo} width="50px" height="50px" className="img-preview " alt="" />
                        </div>
                        <div className="col-9  ps-2 chat-about d-grid align-items-center  text-light">
                          <h6 className="my-0 text-truncate fw-bold">{dataGroup?.group_name == null ? dataGroup?.id : dataGroup?.group_name}</h6>
                          <span>
                            <small>Total Member : {dataGroup?.group_member?.length}</small>
                          </span>
                        </div>
                        {dataGroup?.group_member?.includes(id) ? (
                          <div className="col-xl-1 col-lg-1 dropdown  d-flex justify-content-start">
                            <a className="btn btn-outline-info dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <FontAwesomeIcon icon="fa-solid fa-list" />
                            </a>
                            <ul className="dropdown-menu text-grey dropdown-menu-end mt-3">
                              {dataGroup?.owner_id == id ? (
                                <Fragment>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      onClick={async () => {
                                        await setSidebarPanel(true);
                                        await setMessagePanel(false);
                                        //panel list chat
                                        await setSideBarListChat(false);
                                        await setSideBarListChatPrivate(false);
                                        await setSideBarListChatGroup(false);
                                        await setSidebarListChatSearch(false);
                                        //panel profile
                                        await setSideBarProfile(false);
                                        //panel group
                                        await setSidebarCreateGroup(false);
                                        await setSidebarDetailsGroup(true);
                                        if (size.width >= 992) {
                                          document.getElementById("label-group-chat").click();
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-users-gear" className="col-1 me-2" />
                                      <span className="col-11"> Setting Group</span>
                                    </a>
                                  </li>

                                  <li>
                                    <a
                                      className="dropdown-item"
                                      // onClick={handleDeleteAllPrivateMessage}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-trash" className="col-1 me-2" />
                                      <span className="col-11"> Clear All Message Group</span>
                                    </a>
                                  </li>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      onClick={async () => {
                                        await setSidebarPanel(true);
                                        await setMessagePanel(false);
                                        //panel list chat
                                        await setSideBarListChat(false);
                                        await setSideBarListChatPrivate(false);
                                        await setSideBarListChatGroup(false);
                                        await setSidebarListChatSearch(false);
                                        //panel profile
                                        await setSideBarProfile(false);
                                        //panel group
                                        await setSidebarCreateGroup(false);
                                        await setSidebarDetailsGroup(true);
                                        if (size.width >= 992) {
                                          document.getElementById("label-group-chat").click();
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-users-rectangle" className="col-1 me-2" />
                                      <span className="col-11">Details Group</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" onClick={leaveGroup}>
                                      <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" className="col-1 me-2" />
                                      <span className="col-11">Leave Group</span>
                                    </a>
                                  </li>
                                </Fragment>
                              )}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-12 chat-history py-2 ">
                      <div id="chat-history-panel" className="chat-history-panel container-fluid h-100 w-100 ">
                        {dataGroup?.group_member?.includes(id)
                          ? dataGroup?.message_group?.map((item) =>
                              item?.sender == id ? (
                                <Fragment key={item.id}>
                                  {item.content_type == "ma" ? (
                                    <Fragment>
                                      <div className="ms-4 my-2 text-light d-flex justify-content-end">
                                        <div className="d-grid bg-info rounded text-break">
                                          {u.map((user) =>
                                            item?.sender == user.id ? (
                                              <Fragment key={user.id}>
                                                <div className="d-flex px-2  rounded bg-primary bg-opacity-50 ">
                                                  <Image src={user?.picture == null ? "/assets/icons/ico-user.svg" : user?.picture} width="12px" height="12px" className="img-preview my-auto py-1" alt="" />
                                                  <span className="ms-1  fw-bold  my-auto title-chat">
                                                    {user?.name == null || user?.name == undefined ? (user?.username == null || user?.username == undefined ? user?.email : user?.username) : user?.name}
                                                  </span>
                                                </div>
                                                <span className="d-flex ms-2 me-3 content-chat">{item?.content}</span>
                                                <span className="d-flex mx-1 justify-content-end my-auto time-chat ">
                                                  {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                                </span>
                                              </Fragment>
                                            ) : null
                                          )}
                                        </div>
                                      </div>
                                    </Fragment>
                                  ) : (
                                    <div className="col-12 justify-content-center d-flex my-2 py-0 text-center text-dark ">
                                      <hr className="w-25" />
                                      <span className="mx-2 d-flex my-auto text-secondary">
                                        {u.map((user) =>
                                          item?.sender == user.id ? (
                                            <Fragment key={user.id}>
                                              {item?.content.includes(UsersProfile.username || UsersProfile.email)
                                                ? item?.content.includes("kick out")
                                                  ? `${item?.content?.split(UsersProfile.username || UsersProfile.email)[0]} you're `
                                                  : `You're ${item?.content?.split(UsersProfile.username || UsersProfile.email)[1]}`
                                                : item?.content}
                                            </Fragment>
                                          ) : null
                                        )}
                                      </span>
                                      <hr className="w-25" />
                                    </div>
                                  )}
                                </Fragment>
                              ) : (
                                <Fragment key={item.id}>
                                  {item.content_type == "ma" ? (
                                    <div className="me-4 my-2 text-light d-flex justify-content-start">
                                      <div className="d-grid bg-info rounded text-break">
                                        {u.map((user) =>
                                          item?.sender == user.id ? (
                                            <Fragment key={user.id}>
                                              <div className="d-flex px-2  rounded bg-primary bg-opacity-50 ">
                                                <Image src={user?.picture == null ? "/assets/icons/ico-user.svg" : user?.picture} width="12px" height="12px" className="img-preview my-auto py-1" alt="" />
                                                <span className="ms-1  fw-bold  my-auto title-chat">
                                                  {user?.name == null || user?.name == undefined ? (user?.username == null || user?.username == undefined ? user?.email : user?.username) : user?.name}
                                                </span>
                                              </div>
                                              <span className="d-flex ms-2 me-3 content-chat">{item?.content}</span>
                                              <span className="d-flex mx-1 justify-content-end my-auto time-chat ">
                                                {item?.created_on.split("T")[1].split(".")[0].split(":")[0]}.{item?.created_on.split("T")[1].split(".")[0].split(":")[1]}
                                              </span>
                                            </Fragment>
                                          ) : null
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="col-12 justify-content-center d-flex my-2 py-0 text-center text-dark ">
                                      <hr className="w-25" />
                                      <span className="mx-2 d-flex my-auto text-secondary">
                                        {u.map((user) =>
                                          item?.sender == user.id ? (
                                            <Fragment key={user.id}>{item?.content.includes(UsersProfile.username || UsersProfile.email) ? `You're ${item?.content?.split(UsersProfile.username || UsersProfile.email)[1]}` : item?.content}</Fragment>
                                          ) : null
                                        )}
                                      </span>
                                      <hr className="w-25" />
                                    </div>
                                  )}
                                </Fragment>
                              )
                            )
                          : null}
                        <div ref={messageEndRefGroup} />
                      </div>
                    </div>

                    {dataGroup?.group_member?.includes(id) ? (
                      <form id="form-chat-message" onSubmit={(e) => handleSendGroup(e)}>
                        <div className="col-12 align-self-end d-flex ">
                          <textarea
                            id="text-area-message"
                            className="form-control  text-area-message text-secondary side-scroll w-100"
                            placeholder=""
                            rows={2}
                            onChange={(e) => {
                              setContent(e.target.value);
                            }}
                          />
                          <button type="submit" className="btn btn-info fw-bold text-light icon-send px-5" disabled={enabledSend === true ? false : true}>
                            <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="col-12 align-self-end d-grid ">
                        <button
                          type="submit"
                          className="btn btn-info fw-bold text-light icon-send px-5"
                          onClick={() => {
                            joinGroup();
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-user-plus" className="me-2" /> Join Group
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Mobile>
            </Fragment>
          ) : null}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default HomeChatPanelMessage;
