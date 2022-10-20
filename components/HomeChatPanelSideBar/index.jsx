import { useEffect, Fragment, useState } from "react";
import useWindowSize from "../WindowsSize";
import Image from "next/image";

import IconSearch from "../../public/assets/icons/search.svg";

import socket from "../../app/socket-io.client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDispatch, useSelector } from "react-redux";

import { getUsersProfile } from "../../app/redux/Slice/UsersProfileSlice";
import { putUsersProfilePutProfile } from "../../app/redux/Slice/UsersProfilePutProfileSlice";

import { Desktop, Mobile } from "../Responsive";

import Cookies from "js-cookie";
import { useRouter } from "next/router";

import PageLoader from "next/dist/client/page-loader";
import PreLoader from "../PreLoader";

const HomeChatPanelSideBar = ({
  u,
  setU,
  token,
  setToken,
  refreshToken,
  setRefreshToken,
  sessionId,
  setSessionId,
  id,
  setId,
  //sidebar panel
  sidebarPanel,
  setSidebarPanel,
  sidebarListChat,
  setSideBarListChat,
  sidebarProfile,
  setSideBarProfile,
  sidebarChangeEmail,
  setSidebarChangeEmail,
  sidebarChangePassword,
  setSidebarChangePassword,
  sidebarDeleteAccount,
  setSidebarChangeDeleteAccount,
  //sidebar panel outtools
  userOnline,
  setUserOnline,
  newMessage,
  setNewMessage,
  UsersProfile,
  dispatchGetUsersProfile,
  //message panel
  messagePanel,
  setMessagePanel,
  messagePrivate,
  setMessagePrivate,
  messageCreate,
  setMessageCreate,
  messageGroup,
  setMessageGroup,
  //messagepanel outtools
  idMessage,
  setIdMessage,
  listMessage,
  setListMessage,
}) => {
  const router = useRouter();
  // const size = useWindowSize();

  const handleSelectMessageId = async (e) => {
    await setIdMessage(e);
    await setMessagePanel(true);
    await setMessagePrivate(true);
    await setListMessage([]);
    setU(
      u.map((item) => {
        if (item.userID == e) {
          // Create a *new* object with changes
          return { ...item, messagesUnread: 0 };
        } else {
          // No changes
          return item;
        }
      })
    );
  };

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    id: UsersProfile.id,
    email: UsersProfile.email,
    name: UsersProfile.name,
    username: UsersProfile.username,
    phone: UsersProfile.phone,
    status: UsersProfile.status,
    picture: UsersProfile.picture,
  });

  const [preview, setPreview] = useState();

  const [statusEdit, setStatusEdit] = useState(false);
  const [newPicture, setNewPicture] = useState(null);
  const [btnSave, setBtnSave] = useState(false);
  const [btnEdit, setBtnEdit] = useState(true);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = (e) => {
    setNewPicture(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpdate = async (e) => {
    await e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    formData.append("name", data.name === undefined ? UsersProfile.name : data.name);
    formData.append("username", data.username === undefined ? UsersProfile.username : data.username);
    formData.append("phone", data.phone === undefined ? UsersProfile.phone : data.phone);
    formData.append("status", data.status === undefined ? UsersProfile.status : data.status);
    formData.append("picture", newPicture === undefined || newPicture === null ? UsersProfile.picture : newPicture);

    dispatch(putUsersProfilePutProfile(formData))
      .unwrap()
      .then(() => {
        setNewPicture();
        setPreview();
        dispatchGetUsersProfile();
        setStatusEdit(false);
        setIsLoading(false);
        setBtnSave(false);
        setBtnEdit(true);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // const [sidebarSetting, setSideBarSetting] = useState(false);

  const handleSignOut = async (e) => {
    await e.preventDefault();
    setToken("");
    setRefreshToken("");
    setId("");
    setSessionId("");
    setU("");
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("sessionId");
    Cookies.remove("id");
    router.push("/");
  };

  // console.log(user.filter((item) => item !== e.value))

  const [dataUserNewMessage, setDataUserNewMessage] = useState([]);

  // useEffect(() => {
  //   // setDataUser(u.filter((e) => e.userID == idMessage)[0]);

  //   setDataUserNewMessage(newMessage.filter((e) => e.sender == idMessage)[0]);

  //   return () => {};
  // }, [ socket, u, token, refreshToken, sessionId, id, idMessage, setIdMessage, messagePanel, setMessagePanel, dataUserNewMessage]);

  // newMessage.forEach(e => console.log(e.sender == "699c6dd8-82fb-44bc-97cd-a07a4e7f47c" ))

  console.log(u);
  return (
    <Fragment>
      <PreLoader isLoading={isLoading} />
      {sidebarPanel ? (
        <Fragment>
          {sidebarListChat ? (
            <Fragment>
              <Desktop>
                <div className="col-4  border-end py-3 pe-3 vh-100">
                  <div className="col-12 d-flex ">
                    <div className="dropdown col-2 d-grid border border-1 rounded py-1 ">
                      <a className="col-12 dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image src={UsersProfile.picture === null || UsersProfile.picture === undefined ? "/assets/icons/ico-user.svg" : UsersProfile.picture} width="36px" height="36px" alt="" className="img-preview  py-0" />
                      </a>
                      <ul className="dropdown-menu mt-2">
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={() => {
                              setSideBarListChat(false);
                              setSideBarProfile(true);
                            }}
                          >
                            {" "}
                            <FontAwesomeIcon icon="fa-solid fa-user" className="me-2" />
                            Show Profile
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            <FontAwesomeIcon icon="fa-solid fa-user-shield" /> Privacy & Terms
                          </a>
                        </li>
                        <hr />
                        <li>
                          <a className="dropdown-item" href="/" onClick={handleSignOut}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /> Sign Out
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="border border-1 rounded ps-0 input-group text-secondary py-1">
                      <div className="col-10 text-secondary">
                        <input
                          className="form-control border-0 input-search text-secondary"
                          id="input-search-table"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          //   defaultValue={keyword}
                          // onChange={(e) => setKeyword(e.target.value)}

                          //   onChange={handleKeywordSearchTable}
                          //   onKeyPress={handleKeypressSearchTable}
                        />
                      </div>
                      <div className="col-2 d-flex justify-content-center ">
                        <Image
                          //  onClick={() => {
                          // //   setKeyword(valueInputKeyword);
                          // //   dispatchGetRecruiterJobMyJob()}
                          // }
                          src={IconSearch}
                          width="18px"
                          height="30px "
                          alt=""
                          className="py-0 "
                        />
                      </div>
                    </div>
                  </div>

                  <div id="plist" className="people-list">
                    <ul className="list-unstyled chat-list mt-2 mb-0">
                      {u?.map((e) =>
                        e.userID != id ? (
                          <Fragment key={e.id}>
                            <li
                              className="d-flex align-items-center col-12"
                              onClick={async () => {
                                // console.log(e.id)
                                await handleSelectMessageId(e.id);
                                // dispatchGetMessageGetSenderIdReceiverId(e.id);
                              }}
                            >
                              <div className="col-2 d-flex align-items-center justify-content-center">
                                <Image src={e.picture == null ? "/assets/icons/ico-user.svg" : e.picture} width="48px" height="48px" className="img-round" alt="" />
                              </div>

                              <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{e.email}</span>
                                <div className="col-12 d-flex align-items-center">
                                  <div className="col-10">
                                  {userOnline.some((value) => value == e.userID) ? (
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
                                  {e.messagesUnread == 0 ? null : (
                                    <Fragment>
                                      <div className="col-2 d-flex  justify-content-end align-items-center">
                                        <div className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread">{e.messagesUnread}</div>
                                      </div>
                                    </Fragment>
                                  )}
                                </div>
                              </div>
                            </li>
                          </Fragment>
                        ) : null
                      )}
                    </ul>
                  </div>
                </div>
              </Desktop>
              <Mobile>
                <div className="col-12 py-3 vh-100">
                  <div className="col-12 d-flex ">
                    <div className="dropdown col-2 d-grid border border-1 rounded py-1 ">
                      <a className="col-12 dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image src={UsersProfile.picture === null || UsersProfile.picture === undefined ? "/assets/icons/ico-user.svg" : UsersProfile.picture} width="36px" height="36px" alt="" className="img-preview  py-0" />
                      </a>
                      <ul className="dropdown-menu mt-2">
                        <li>
                          <a className="dropdown-item" href="#">
                            <FontAwesomeIcon icon="fa-solid fa-comments" /> Message a Friends
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            <FontAwesomeIcon icon="fa-solid fa-user-group" /> Create Group
                          </a>
                        </li>
                        <hr />
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={async () => {
                              await setSideBarListChat(false);
                              await setSideBarProfile(true);
                            }}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-user" className="me-2" />
                            Show Profile
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            <FontAwesomeIcon icon="fa-solid fa-user-shield" /> Privacy & Terms
                          </a>
                        </li>
                        <hr />
                        <li>
                          <a className="dropdown-item" href="/" onClick={handleSignOut}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /> Sign Out
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="border border-1 rounded ps-0 input-group text-secondary py-1">
                      <div className="col-10 text-secondary">
                        <input
                          className="form-control border-0 input-search text-secondary"
                          id="input-search-table"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          //   defaultValue={keyword}
                          // onChange={(e) => setKeyword(e.target.value)}

                          //   onChange={handleKeywordSearchTable}
                          //   onKeyPress={handleKeypressSearchTable}
                        />
                      </div>
                      <div className="col-2 d-flex justify-content-center ">
                        <Image
                          //  onClick={() => {
                          // //   setKeyword(valueInputKeyword);
                          // //   dispatchGetRecruiterJobMyJob()}
                          // }
                          src={IconSearch}
                          width="18px"
                          height="30px "
                          alt=""
                          className="py-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div id="plist" className="people-list">
                    <ul className="list-unstyled chat-list mt-2 mb-0">
                      {u?.map((e) =>
                        e.userID != id ? (
                          <Fragment key={e.id}>
                            <li
                              className="d-flex align-items-center"
                              onClick={async () => {
                                // console.log(e.id)

                                // await setSideBarProfile(false);
                                // await setSideBarListChat(false);
                                await setSidebarPanel(false);
                                await handleSelectMessageId(e.id);

                                // dispatchGetMessageGetSenderIdReceiverId(e.id);
                              }}
                            >
                              <div className="col-2 d-flex align-items-center justify-content-center">
                                <Image src={e.picture == null ? "/assets/icons/ico-user.svg" : e.picture} width="48px" height="48px" className="img-round" alt="" />
                              </div>

                              <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{e.email}</span>
                                <div className="d-flex align-items-center">
                                  <div className="col-10">
                                    {userOnline.some((value) => value == e.userID) ? (
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
                                  {e.messagesUnread == 0 ? null : (
                                    <Fragment>
                                      <div className="col-2 d-flex  justify-content-end align-items-center">
                                        <div className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center icon-unread ">{e.messagesUnread}</div>
                                      </div>
                                    </Fragment>
                                  )}
                                </div>
                              </div>
                            </li>
                          </Fragment>
                        ) : null
                      )}
                    </ul>
                  </div>
                </div>
              </Mobile>
            </Fragment>
          ) : null}
          {sidebarProfile ? (
            <Fragment>
              <Desktop>
                <div className="col-4 py-3 vh-100">
                  <form onSubmit={handleUpdate}>
                    <div className="col-12 d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-outline-info px-3"
                        onClick={async () => {
                          await setSideBarProfile(false);
                          await setSideBarListChat(true);
                          setStatusEdit(false);
                          setBtnSave(false);
                          setBtnEdit(true);
                        }}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                        Back
                      </button>
                      <div className="d-grid">
                        {btnEdit ? (
                          <Fragment>
                            <button
                              type="button"
                              className="btn btn-info px-4 text-light"
                              onClick={() => {
                                setStatusEdit(true);
                                setBtnSave(true);
                                setBtnEdit(false);
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Edit Profile
                            </button>
                          </Fragment>
                        ) : null}
                      </div>
                    </div>
                    <div className="container col-12 mt-5">
                      <div className="col-12 d-flex justify-content-center ">
                        <Image
                          src={preview === null || preview === undefined ? (UsersProfile.picture === null || UsersProfile.picture === undefined ? "/assets/icons/ico-user.svg" : UsersProfile.picture) : preview}
                          width="210px"
                          height="210px"
                          className="img-preview"
                          alt=""
                        />
                      </div>
                      <div className="col-12 d-flex justify-content-center upload-btn-wrapper mb-5 mt-3">
                        <button type="button" className="btn btn-outline-secondary ">
                          <FontAwesomeIcon icon="fa-solid fa-camera" className="mx-2" />
                          Select Picture
                        </button>
                        <input className="form-control" type="file" id="formFile" name="picture" onChange={handleUpload} disabled={statusEdit === true ? false : true} />
                      </div>

                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />{" "}
                        </div>
                        <input
                          className="form-control border-0  text-secondary"
                          name="name"
                          type="text"
                          placeholder="Full Name"
                          aria-label="Full Name"
                          onChange={handleChange}
                          defaultValue={UsersProfile.name === undefined || UsersProfile.name == null ? null : UsersProfile.name}
                          disabled={statusEdit === true ? false : true}
                        />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                        </div>
                        <input
                          className="form-control border-0  text-secondary "
                          name="username"
                          type="text"
                          placeholder="Username"
                          aria-label="Username"
                          onChange={handleChange}
                          defaultValue={UsersProfile.username === undefined || UsersProfile.username == null ? null : UsersProfile.username}
                          disabled={statusEdit === true ? false : true}
                        />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-at" className="text-secondary " />{" "}
                        </div>
                        <input
                          className="form-control border-0 text-secondary"
                          name="email"
                          type="text"
                          placeholder="Email"
                          aria-label="Email"
                          onChange={handleChange}
                          defaultValue={UsersProfile.email === undefined || UsersProfile.email == null ? null : UsersProfile.email}
                          disabled
                        />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-circle-exclamation" className="text-secondary " />
                        </div>
                        <input
                          className="form-control border-0  text-secondary"
                          name="status"
                          // id="input-search-table"
                          type="text"
                          placeholder="Status"
                          aria-label="Status"
                          onChange={handleChange}
                          maxLength="39"
                          defaultValue={UsersProfile.status === undefined || UsersProfile.status == null ? null : UsersProfile.status}
                          disabled={statusEdit === true ? false : true}
                        />
                      </div>
                      <div className="col-12 mt-3" style={{ display: btnSave ? "block" : "none" }}>
                        <div className="col-12 d-grid">
                          <button type="submit" className="btn btn-info px-4 text-light">
                            <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Save Profile
                          </button>
                        </div>
                      </div>

                      <div className="d-grid align-items-center mt-4">
                        <button type="button" className="btn btn-outline-info col-12 d-flex align-items-center justify-content-center my-2">
                          <FontAwesomeIcon icon="fa-solid fa-key" className="mx-2" />
                          Change Password
                        </button>
                        <button type="button" className="btn btn-outline-info col-12 d-flex align-items-center justify-content-center my-2 ">
                          <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="mx-2" />
                          Change Email
                        </button>
                        <button type="button" className="btn btn-outline-danger col-12 d-flex align-items-center justify-content-center my-2 ">
                          <FontAwesomeIcon icon="fa-solid fa-user-slash" className="mx-2" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Desktop>
              <Mobile>
                <div className="col-12 py-3 vh-100">
                  <form onSubmit={handleUpdate}>
                    <div className="col-12 d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-outline-info px-3"
                        onClick={async () => {
                          await setSideBarProfile(false);
                          await setSideBarListChat(true);
                          setStatusEdit(false);
                          setBtnSave(false);
                          setBtnEdit(true);
                        }}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                        Back
                      </button>
                      <div className="d-grid">
                        {btnEdit ? (
                          <Fragment>
                            <button
                              type="button"
                              className="btn btn-info px-4 text-light"
                              onClick={() => {
                                setStatusEdit(true);
                                setBtnSave(true);
                                setBtnEdit(false);
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Edit Profile
                            </button>
                          </Fragment>
                        ) : null}
                      </div>
                    </div>
                    <div className="container col-12 mt-5">
                      <div className="col-12 d-flex justify-content-center ">
                        <Image
                          src={preview === null || preview === undefined ? (UsersProfile.picture === null || UsersProfile.picture === undefined ? "/assets/icons/ico-user.svg" : UsersProfile.picture) : preview}
                          width="210px"
                          height="210px"
                          className="img-preview"
                          alt=""
                        />
                      </div>
                      <div className="col-12 d-flex justify-content-center upload-btn-wrapper mb-5 mt-3">
                        <button type="button" className="btn btn-outline-secondary ">
                          <FontAwesomeIcon icon="fa-solid fa-camera" className="mx-2" />
                          Select Picture
                        </button>
                        <input className="form-control" type="file" id="formFile" name="picture" onChange={handleUpload} disabled={statusEdit === true ? false : true} />
                      </div>

                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />{" "}
                        </div>
                        <input
                          className="form-control border-0  text-secondary"
                          name="name"
                          type="text"
                          placeholder="Full Name"
                          aria-label="Full Name"
                          onChange={handleChange}
                          defaultValue={UsersProfile.name === undefined || UsersProfile.name == null ? null : UsersProfile.name}
                          disabled={statusEdit === true ? false : true}
                        />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                        </div>
                        <input
                          className="form-control border-0  text-secondary "
                          name="username"
                          type="text"
                          placeholder="Username"
                          aria-label="Username"
                          onChange={handleChange}
                          defaultValue={UsersProfile.username === undefined || UsersProfile.username == null ? null : UsersProfile.username}
                          disabled={statusEdit === true ? false : true}
                        />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-at" className="text-secondary " />{" "}
                        </div>
                        <input
                          className="form-control border-0 text-secondary"
                          name="email"
                          type="text"
                          placeholder="Email"
                          aria-label="Email"
                          onChange={handleChange}
                          defaultValue={UsersProfile.email === undefined || UsersProfile.email == null ? null : UsersProfile.email}
                          disabled
                        />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-circle-exclamation" className="text-secondary " />
                        </div>
                        <input
                          className="form-control border-0  text-secondary"
                          name="status"
                          // id="input-search-table"
                          type="text"
                          placeholder="Status"
                          aria-label="Status"
                          onChange={handleChange}
                          maxLength="39"
                          defaultValue={UsersProfile.status === undefined || UsersProfile.status == null ? null : UsersProfile.status}
                          disabled={statusEdit === true ? false : true}
                        />
                      </div>
                      <div className="col-12 mt-3" style={{ display: btnSave ? "block" : "none" }}>
                        <div className="col-12 d-grid">
                          <button type="submit" className="btn btn-info px-4 text-light">
                            <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Save Profile
                          </button>
                        </div>
                      </div>

                      <div className="d-grid align-items-center mt-4">
                        <button type="button" className="btn btn-outline-info col-12 d-flex align-items-center justify-content-center my-2">
                          <FontAwesomeIcon icon="fa-solid fa-key" className="mx-2" />
                          Change Password
                        </button>
                        <button type="button" className="btn btn-outline-info col-12 d-flex align-items-center justify-content-center my-2 ">
                          <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="mx-2" />
                          Change Email
                        </button>
                        <button type="button" className="btn btn-outline-danger col-12 d-flex align-items-center justify-content-center my-2 ">
                          <FontAwesomeIcon icon="fa-solid fa-user-slash" className="mx-2" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Mobile>
            </Fragment>
          ) : null}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default HomeChatPanelSideBar;
