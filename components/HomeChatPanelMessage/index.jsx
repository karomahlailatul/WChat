import { useState, useEffect, Fragment, useRef } from "react";
import useWindowSize from "../WindowsSize";
import socket from "../../app/socket-io.client";
import Image from "next/image";

import { useDispatch, 
  // useSelector 
} from "react-redux";

// import Cookies from "js-cookie";
// import { getRecruiterProfile } from "../app/redux/Slice/RecruiterProfileSlice";

import { Desktop, Mobile } from "../Responsive";

// import { getMessageGetSenderIdReceiverId } from "../../app/redux/Slice/MessageGetSenderIdReceiverId";
import PreLoaderComponent from "../PreLoaderComponent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { deleteMessageDeleteAllPrivateMessage } from "../../app/redux/Slice/MessageDeleteAllPrivateMessage";
const HomeChatPanelMessage = ({
  u,
  setU,
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
  // sidebarListChat,
  // setSideBarListChat,
  // sidebarProfile,
  // setSideBarProfile,
  // sidebarChangeEmail,
  // setSidebarChangeEmail,
  // sidebarChangePassword,
  // setSidebarChangePassword,
  // sidebarDeleteAccount,
  // setSidebarChangeDeleteAccount,
  //sidebar panel outtools
  userOnline,
  // setUserOnline,
  // newMessage,
  // setNewMessage,
  // UsersProfile,
  // dispatchGetUsersProfile,
  //message panel
  messagePanel,
  setMessagePanel,
  messagePrivate,
  setMessagePrivate,
  messageCreate,
  // setMessageCreate,
  messageGroup,
  // setMessageGroup,
  //messagepanel outtools
  idMessage,
  setIdMessage,
  listMessage,
  setListMessage,
}) => {
  const size = useWindowSize();

  const [dataUser, setDataUser] = useState([]);
  const [content, setContent] = useState("");

  // const { isLoading } = useSelector((state) => state.MessageGetSenderIdReceiverId);

  const [isLoadingMessage, setIsLoadingMessage] = useState(true);

  const messageEndRef = useRef(null);

  const dispatch = useDispatch();

  const sender = id;
  const receiver = idMessage;

  const handleDeleteAllPrivateMessage = () => {
    dispatch(deleteMessageDeleteAllPrivateMessage({ sender, receiver }))
      .unwrap()
      .then((item) => {
        if (item.statusCode === 200) {
          setListMessage(null);
          setMessagePanel(false);
          setSidebarPanel(true);
          setU(
            u.map((item) => {
              if (item.userID == receiver) {
                // Create a *new* object with changes
                return { ...item, messages: [] ,  messagesUnread: 0};
              } else {
                // No changes
                return item;
              }
            })
          );
        }
      });
  };

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
  };

  useEffect(() => {
    setDataUser(u.filter((e) => e.userID == idMessage)[0]);
    setIsLoadingMessage(false)
    // setDataUserNewMessage(newMessage.filter((e) => e.sender == idMessage)[0]);

    return () => {};
  }, [dispatch, socket, u, token, refreshToken, sessionId, id, idMessage, setIdMessage, messagePanel, setMessagePanel, dataUser]);

  const actionMessageEndRef = async () => {
    await messageEndRef?.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  };

  useEffect(() => {
    actionMessageEndRef();
  }, [listMessage]);

  useEffect(() => {
    if (size.width >= 992 && !sidebarPanel) {
      setSidebarPanel(true);
    } else if (size.width <= 992 && messagePanel) {
      setSidebarPanel(true);
      setMessagePanel(false);
    }
  }, [size]);

  // console.log(newMessage)

  return (
    <Fragment>
      {messagePanel == true ? (
        <Fragment>
          {messagePrivate ? (
            <Fragment>
              <Desktop>
                <div className=" col-8 d-flex align-items-center ">
                  <div className="chat container pt-3 h-100 ">
                    <div className="chat-header card bg-info border-0 shadow  ">
                      <div className="container col-12 d-flex py-3">
                        <div className="col-xl-1 col-lg-1 d-flex justify-content-center" data-toggle="modal" data-target="#view_info">
                          <Image src={dataUser?.picture == null ? "/assets/icons/ico-user.svg" : dataUser?.picture} width="50px" height="50px" className="img-preview" alt="" />
                        </div>
                        <div className="col-xl-10 col-lg-10 ps-2 chat-about d-grid align-items-center">
                          <h6 className="my-0 text-truncate text-light fw-bold">{dataUser?.username == null || dataUser?.username == "null" ? dataUser?.email : dataUser?.username}</h6>

                          {/* <h6 className="my-0 text-truncate text-light fw-bold">{dataUser?.username == null ? dataUser?.email : dataUser?.username}</h6> */}
                          {/* <small>{Last seen: 2 hours ago}</small> */}
                          {/* <small className="status text-light">{(userOnline.some(value => value == (idMessage))) ? <Fragment>online</Fragment> : <Fragment>offline</Fragment>}</small> */}
                          <div className="d-flex align-items-center text-light">
                            {userOnline.some((value) => value == idMessage) ? (
                              <Fragment>
                                <span className="icon-online" />
                                <small className="">Online</small>
                             
                               

                              </Fragment>
                            ) : (
                              <Fragment>
                             
                                  <span className="icon-offline" />
                                <small className="">Offline</small>
                                
                
                                
                              </Fragment>
                            )}
                          </div>
                        </div>
                        <div className="col-xl-1 col-lg-1 dropdown  d-flex justify-content-start">
                          <a className="btn btn-outline-info dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon="fa-solid fa-list" />
                          </a>
                          <ul className="dropdown-menu text-grey dropdown-menu-end mt-3">
                            <li>
                              <a
                                className="dropdown-item"
                                // onClick={() => {
                                //   setSideBarListChat(false);
                                //   setSideBarProfile(true);
                                // }}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-user-tag" className="me-2" />
                                View Profile
                              </a>
                            </li>

                            <li>
                              <a className="dropdown-item" onClick={handleDeleteAllPrivateMessage}>
                                <FontAwesomeIcon icon="fa-solid fa-trash" className="me-2" /> Clear All Message
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="chat-history my-2">
                      <div id="chat-history-panel" className="chat-history-panel h-100 px-3">
                        <PreLoaderComponent isLoading={isLoadingMessage} />

                        {dataUser?.messages?.map((item, index) =>
                          item?.sender == id ? (
                            <Fragment key={index}>
                              {/* <div className="d-flex justify-content-end my-2  ">
                                  <div className="d-flex justify-content-start card px-3 align-items-center my-auto bg-info  border-0">
                                    <div className="fs-6 my-2 text-light">{item?.content}</div>
                                  </div>
                                </div> */}
                              <div className="d-flex justify-content-end my-2  ">
                                <div className="d-flex justify-content-start card px-3 align-items-center my-auto bg-info  border-0">
                                  <div className="fs-6 my-2 text-light">{item?.content}</div>
                                </div>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment key={index}>
                              <div className="d-flex justify-content-start my-2  ">
                                <div className="d-flex justify-content-start card px-3 align-items-center my-auto bg-info border-0">
                                  <div className="fs-6 my-2 text-light">{item?.content}</div>
                                </div>
                              </div>
                            </Fragment>
                          )
                        )}
                        <div ref={messageEndRef} />
                      </div>
                    </div>
                    <form id="form-chat-message" onSubmit={(e) => handleSend(e)} className="chat-submit">
                      <div className="col-12 d-flex ">
                        {/* <div className="col-2 d-grid">
                            <button className="btn btn-outline-primary "></button>
                          </div> */}
                        <textarea type="text" className="form-control text-area-message text-secondary" placeholder="" rows="1" onChange={(e) => setContent(e.target.value)} />

                        <button type="submit" className="btn btn-info fw-bold text-light icon-send px-4">
                          <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Desktop>
              <Mobile>
                <div className="col-12 d-flex align-items-center  pt-3  ">
                  <div className="col-12 h-100 ">
                    <div className="col-12 chat-header card bg-info border-0 shadow d-flex align-items-center justify-content-center rounded ">
                      <div className="col-12 d-flex py-3">
                        <div
                          className="col-1 d-flex justify-content-center align-items-center cursor-pointer"
                          onClick={() => {
                            setSidebarPanel(true);
                            setMessagePanel(false);
                            setMessagePrivate(false);
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-chevron-left" className="ms-2 text-light" />
                        </div>
                        <div className="col-1 d-flex justify-content-center">
                          <Image src={dataUser?.picture == null ? "/assets/icons/ico-user.svg" : dataUser?.picture} width="50px" height="50px" className="img-preview" alt="" />
                        </div>
                        <div className="col-9 ps-2 chat-about d-grid align-items-center">
                          <h6 className="my-0 text-truncate text-light fw-bold">{dataUser?.username == null ? dataUser?.email : dataUser?.username}</h6>
                          {/* <small>{Last seen: 2 hours ago}</small> */}
                          {/* <small className="status text-light">{(userOnline.some(value => value == (idMessage))) ? <Fragment>online</Fragment> : <Fragment>offline</Fragment>}</small> */}
                          <div className="d-flex align-items-center text-light">
                            {userOnline.some((value) => value == idMessage) ? (
                              <Fragment>
                                <span className="icon-online" />
                                <small className="">Online</small>
                              </Fragment>
                            ) : (
                              <Fragment>
                                <span className="icon-offline" />
                                <small className="">Offline</small>
                              </Fragment>
                            )}
                          </div>
                        </div>
                        <div className="col-1 dropdown d-flex justify-content-center">
                          <a className="btn btn-outline-info dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon="fa-solid fa-list" />
                          </a>
                          <ul className="dropdown-menu text-grey dropdown-menu-end mt-3">
                            <li>
                              <a
                                className="dropdown-item"
                                // onClick={() => {
                                //   setSideBarListChat(false);
                                //   setSideBarProfile(true);
                                // }}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-user-tag" className="me-2" />
                                View Profile
                              </a>
                            </li>

                            <li>
                              <a className="dropdown-item" onClick={handleDeleteAllPrivateMessage}>
                                <FontAwesomeIcon icon="fa-solid fa-trash" className="me-2" /> Clear All Message
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="chat-history my-2 ">
                      <div id="chat-history-panel" className="chat-history-panel h-100 px-3">
                        <PreLoaderComponent isLoading={isLoadingMessage} />

                        {dataUser?.messages?.map((item, index) =>
                          item?.sender == id ? (
                            <Fragment key={index}>
                              {/* <div className="d-flex justify-content-end my-2  ">
                                  <div className="d-flex justify-content-start card px-3 align-items-center my-auto bg-info  border-0">
                                    <div className="fs-6 my-2 text-light">{item?.content}</div>
                                  </div>
                                </div> */}
                              <div className="d-flex justify-content-end my-2  ">
                                <div className="d-flex justify-content-start card px-3 align-items-center my-auto bg-info  border-0">
                                  <div className="fs-6 my-2 text-light">{item?.content}</div>
                                </div>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment key={index}>
                              <div className="d-flex justify-content-start my-2  ">
                                <div className="d-flex justify-content-start card px-3 align-items-center my-auto bg-info border-0">
                                  <div className="fs-6 my-2 text-light">{item?.content}</div>
                                </div>
                              </div>
                            </Fragment>
                          )
                        )}
                        <div ref={messageEndRef} />
                      </div>
                    </div>
                    <form id="form-chat-message" onSubmit={(e) => handleSend(e)} className="chat-submit">
                      <div className="col-12 d-flex ">
                        {/* <div className="col-2 d-grid">
                            <button className="btn btn-outline-primary "></button>
                          </div> */}
                        <textarea type="text" className="form-control text-area-message text-secondary" placeholder="" rows="1" onChange={(e) => setContent(e.target.value)} />

                        <button type="submit" className="btn btn-info fw-bold text-light icon-send px-5">
                          <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Mobile>
            </Fragment>
          ) : null}
          {messageCreate ? <Fragment></Fragment> : null}
          {messageGroup ? <Fragment></Fragment> : null}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default HomeChatPanelMessage;
