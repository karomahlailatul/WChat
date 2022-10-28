import { useEffect, Fragment, useState } from "react";
import Image from "next/image";
import IconSearch from "../../public/assets/icons/search.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { putUsersProfilePutProfile } from "../../app/redux/Slice/UsersProfilePutProfileSlice";
import { postGroupChatPostGroupChat } from "../../app/redux/Slice/PostGroupChatSlice";
import { Desktop, Mobile } from "../Responsive";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import PreLoader from "../PreLoader";
import socket from "../../app/socket-io.client";
import { toast } from "react-toastify";
import useWindowSize from "../WindowsSize";
import { orderBy } from "lodash";
import { putGroupChatPutGroupChat } from "../../app/redux/Slice/PutGroupChatSlice";

const HomeChatPanelSideBar = ({
  u,
  setU,
  g,
  setG,
  // token,
  setToken,
  // refreshToken,
  setRefreshToken,
  // sessionId,
  setSessionId,
  id,
  setId,

  //sidebar panel
  sidebarPanel,
  setSidebarPanel,

  //sidebar panel component
  sidebarListChat,
  setSideBarListChat,
  sidebarListChatPrivate,
  setSideBarListChatPrivate,
  sidebarListChatGroup,
  setSideBarListChatGroup,
  sidebarListChatSearch,
  setSidebarListChatSearch,

  sidebarProfile,
  setSideBarProfile,
  // sidebarChangeEmail,
  // setSidebarChangeEmail,
  // sidebarChangePassword,
  // setSidebarChangePassword,
  // sidebarDeleteAccount,
  // setSidebarChangeDeleteAccount,
  // sidebarListGroup,
  // setSidebarListGroup,
  sidebarCreateGroup,
  setSidebarCreateGroup,
  // sidebarEditGroup,
  // setSidebarEditGroup,
  sidebarDetailsGroup,
  setSidebarDetailsGroup,

  //sidebar panel outtools
  userOnline,
  // setUserOnline,
  // newMessage,
  // setNewMessage,
  // newMessageGroup,
  // setNewMessageGroup,
  UsersProfile,
  setUsersProfile,
  dispatchGetUsersProfile,

  //message panel
  messagePanel,
  setMessagePanel,

  //message panel component
  // messagePrivate,
  setMessagePrivate,
  // messageCreate,
  // setMessageCreate,
  // messageGroup,
  setMessageGroup,

  //message outtools
  idMessage,
  setIdMessage,
  // idMessageGroup,
  // setIdMessageGroup,
  // listMessage,
  setListMessage,
  // listMessageGroup,
  // setListMessageGroup,
}) => {
  const router = useRouter();
  const size = useWindowSize();

  // handle switch group / private
  const handleSwitchPrivateChat = () => {
    setSideBarListChatPrivate(true);
    setSideBarListChatGroup(false);
    setSidebarListChatSearch(false);
  };
  const handleSwitchGroupChat = () => {
    setSideBarListChatPrivate(false);
    setSideBarListChatGroup(true);
    setSidebarListChatSearch(false);
  };

  // select and show message private
  const handleSelectMessagePrivateId = async (e) => {
    await setIdMessage(e);
    await setMessagePanel(true);
    await setMessagePrivate(true);
    await setMessageGroup(false);
    await setListMessage([]);
    await setU(
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

  // select and show message private
  const handleSelectMessageGroupId = async (e) => {
    await setIdMessage(e);
    await setMessagePanel(true);
    await setMessageGroup(true);
    await setMessagePrivate(false);
    await setListMessage([]);
    await setG(
      g.map((item) => {
        if (item.id == e) {
          // Create a *new* object with changes
          return { ...item, message_group_unread: 0 };
        } else {
          // No changes
          return item;
        }
      })
    );
  };

  // update profile
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
    // eslint-disable-next-line no-useless-escape
    const RegexId = /^\w[a-zA-Z0-9_\-]*$/;
    try {
      if (!RegexId.test(data.username)) throw "Username only Character, number, and symbol(-_)";
    } catch (err) {
      return toast.warning(err, { toastId: "errorUsername" });
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name === undefined ? UsersProfile.name : data.name);
    formData.append("username", data.username === undefined ? UsersProfile.username : data.username);
    formData.append("phone", data.phone === undefined ? UsersProfile.phone : data.phone);
    formData.append("status", data.status === undefined ? UsersProfile.status : data.status);
    formData.append("picture", newPicture === undefined || newPicture === null ? UsersProfile.picture : newPicture);
    dispatch(putUsersProfilePutProfile(formData))
      .unwrap()
      .then((res) => {
        setNewPicture();
        setPreview();
        dispatchGetUsersProfile();
        setStatusEdit(false);
        setIsLoading(false);
        setBtnSave(false);
        setBtnEdit(true);

        const { name, email, username, phone, status, picture } = res.data[0];
        setU(
          u.map((item) => {
            if (item.id == id) {
              // Create a *new* object with changes
              return {
                ...item,
                name: name == undefined || name == null ? null : name,
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

        setUsersProfile({
          ...UsersProfile,
          name: name == undefined || name == null ? null : name,
          username: username == undefined || username == null ? null : username,
          phone: phone == undefined || phone == null ? null : phone,
          status: status == undefined || status == null ? null : status,
          picture: picture == undefined || picture == null ? null : picture,
        });

        socket.emit("updatedUsers", {
          id,
          email,
          name,
          username,
          phone,
          status,
          picture,
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // sign out
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

  // searching filter
  const [keywordSearch, setKeywordSearch] = useState();
  const handleSearch = async (e) => {
    setKeywordSearch(e.target.value);
  };
  useEffect(() => {
    if (keywordSearch != null || keywordSearch != "" || keywordSearch != undefined) {
      setSidebarListChatSearch(true);
      setSideBarListChatPrivate(false);
      setSideBarListChatGroup(false);
    }
    if (keywordSearch == null || keywordSearch == "" || keywordSearch == undefined) {
      setSidebarListChatSearch(false);
      setSideBarListChatPrivate(true);
      setSideBarListChatGroup(false);
    }
  }, [keywordSearch]);

  // create group
  const [dataGroup, setDataGroup] = useState({
    id: "",
    owner_id: id,
    group_name: "",
    group_logo: "",
    group_member: [id],
  });
  const handleChangeGroup = (e) => {
    setDataGroup({
      ...dataGroup,
      [e.target.name]: e.target.value,
    });
  };
  const handleUploadGroup = (e) => {
    setNewLogoGroup(e.target.files[0]);
    setPreviewLogoGroup(URL.createObjectURL(e.target.files[0]));
  };
  const [previewLogoGroup, setPreviewLogoGroup] = useState();
  const [newLogoGroup, setNewLogoGroup] = useState(null);
  const sender = id;
  const handleCreateGroup = async (e) => {
    await e.preventDefault();
    // eslint-disable-next-line no-useless-escape
    const RegexId = /^\w[a-zA-Z0-9_\-]*$/;
    try {
      if (!dataGroup.id) throw "ID group must filled";
      if (!RegexId.test(dataGroup.id)) throw "ID group only Character, number, and symbol(-_)";
      if (!dataGroup.group_name) throw "Name group must filled";
    } catch (err) {
      return toast.warning(err, { toastId: "errorIdGroup" });
    }

    setIsLoading(true);

    const group_chat_id = dataGroup.id;
    const owner_id = dataGroup.owner_id;
    const group_member = dataGroup.group_member;
    const group_name = dataGroup.group_name;

    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const created_on = new Date().toISOString();
    const users_created_on = UsersProfile.created_on;
    const { userID, email, name, username, phone, status, picture } = UsersProfile;
    const content_type = "mb";
    const content = `${username == null || username == undefined ? email : username} created group`;

    const dataGroupMemberListForward = JSON.stringify(dataGroup.group_member).replace(`[`, ``).replace(`]`, ``);

    const formData = new FormData();
    formData.append("id", dataGroup.id);
    formData.append("owner_id", userID);
    formData.append("group_name", dataGroup.group_name);
    formData.append("group_logo", newLogoGroup);
    formData.append("group_member", dataGroupMemberListForward);
    dispatch(postGroupChatPostGroupChat(formData))
      .unwrap()
      .then(async (res) => {
        document.getElementById("form-create-group").reset();
        setNewLogoGroup();
        setPreviewLogoGroup();
        dispatchGetUsersProfile();
        // await setSideBarProfile(false);
        await setSidebarCreateGroup(false);
        const group_logo = res?.data[0]?.group_logo;
        await setIdMessage(group_chat_id);
        setG((g) => [
          ...g,
          {
            id: group_chat_id,
            owner_id: userID,
            email: email,
            group_logo: group_logo,
            group_member: dataGroup.group_member,
            group_name: dataGroup.group_name,
            message_group: [{ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
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

        socket.emit("createGroup", {
          id,
          content,
          content_type,
          sender,
          group_chat_id,
          created_on,
          email,
          name,
          username,
          phone,
          status,
          picture,
          users_created_on,
          owner_id,
          group_member,
          group_name,
          group_logo,
        });

        if (size.width >= 992) {
          await setSidebarPanel(false);

          await setSideBarListChat(true);
          await setSideBarListChatGroup(true);
          await setSideBarListChatPrivate(false);
          await setSidebarListChatSearch(false);
          await setMessagePanel(true);
          await setMessageGroup(true);
          await setMessagePrivate(false);
        }
        if (size.width <= 992) {
          await setSidebarPanel(false);
          await setSideBarListChat(false);
          await setMessagePanel(true);
          await setMessageGroup(true);
          await setMessagePrivate(false);
        }
        document.getElementById("btn-back-create-group").click();
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  //edit group
  useEffect(() => {
    if (sidebarDetailsGroup) {
      setDataGroup(g.filter((e) => e.id == idMessage)[0]);
    }
  }, [g, sidebarDetailsGroup]);
  const handleUpdateGroup = async (e) => {
    await e.preventDefault();
    // eslint-disable-next-line no-useless-escape
    const RegexId = /^\w[a-zA-Z0-9_\-]*$/;
    try {
      if (!dataGroup.id) throw "ID group must filled";
      if (!RegexId.test(dataGroup.id)) throw "ID group only Character, number, and symbol(-_)";
      if (!dataGroup.group_name) throw "Name group must filled";
    } catch (err) {
      return toast.warning(err, { toastId: "errorIdGroup" });
    }

    setIsLoading(true);

    const group_chat_id = dataGroup.id;
    const owner_id = dataGroup.owner_id;
    const group_member = dataGroup.group_member;
    const group_name = dataGroup.group_name;

    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const created_on = new Date().toISOString();
    const users_created_on = UsersProfile.created_on;
    const { userID, email, name, username, phone, status, picture } = UsersProfile;
    const content_type = "mb";
    const content = `${username == null || username == undefined ? email : username} updated group`;

    const dataGroupMemberListForward = JSON.stringify(dataGroup.group_member).replace(`[`, ``).replace(`]`, ``);

    const formData = new FormData();
    formData.append("id", dataGroup.id);
    formData.append("owner_id", userID);
    formData.append("group_name", dataGroup.group_name);
    formData.append("group_logo", newLogoGroup);
    formData.append("group_member", dataGroupMemberListForward);
    dispatch(putGroupChatPutGroupChat({ group_chat_id, formData }))
      .unwrap()
      .then(async (res) => {
        document.getElementById("form-edit-group").reset();
        setNewLogoGroup();
        setPreviewLogoGroup();
        dispatchGetUsersProfile();
        // await setSideBarProfile(false);
        await setSidebarCreateGroup(false);

        const group_logo = res?.data[0]?.group_logo;

        setG(
          g.map((item) => {
            if (item.id == dataGroup.id) {
              // Create a *new* object with changes
              return {
                ...item,
                message_group: [...item.message_group, { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }],
                message_group_unread: 0,
                id: group_chat_id,
                owner_id: owner_id,
                email: email,
                group_logo: group_logo,
                group_member: dataGroup.group_member,
                group_name: dataGroup.group_name,

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

        socket.emit("updatedGroup", {
          id,
          content,
          content_type,
          sender,
          group_chat_id,
          created_on,
          email,
          name,
          username,
          phone,
          status,
          picture,
          users_created_on,
          owner_id,
          group_member,
          group_name,
          group_logo,
        });

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  //edit member
  const leaveGroupAdmin = async (member) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const created_on = new Date().toISOString();

    const group_chat_id = dataGroup.id;
    const users_created_on = UsersProfile.created_on;
    const { email, name, username, phone, status, picture } = UsersProfile;
    const content_type = "mb";
    let content;
    let notification;
    await u.map((user) => {
      if (user.id == member) {
        content = `${username == null || username == undefined ? email : username} kick out ${user.username == null || user.username == undefined ? user.email : user.username}`;
        notification = user.username == null || user.username == undefined ? user.email : user.username;
      }
    });
    const listMemberUpdate = [];

    await setG(
      g.map((item) => {
        if (item.id == group_chat_id) {
          item.group_member.map((item_member) => {
            if (item_member != member) {
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

    const dataGroupMemberListForward = JSON.stringify(listMemberUpdate).replace(`[`, ``).replace(`]`, ``);
    socket.emit("leaveGroupAdmin", { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on, dataGroupMemberListForward });
    toast.success(`You're Success Kick ${notification}`, { toastId: "successKickMember" });
  };
  //remove group
  const handleRemoveGroup = async () => {
    const group_chat_id = dataGroup.id;
    setListMessage([]);
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

    document.getElementById("label-group-chat").click();
    socket.emit("removeGroup", { group_chat_id });

    setG(g.filter((item) => item.id != group_chat_id));
    toast.success(`You're Success Remove Group`, { toastId: "successRemoveGroup" });
  };

  //count message private
  const [countMessagePrivate, setCountMessagePrivate] = useState(0);
  useEffect(() => {
    let count = 0;
    u.map((item) => (count = count + item.messagesUnread));
    setCountMessagePrivate(count);
  }, [u]);

  //count message group
  const [countMessageGroup, setCountMessageGroup] = useState(0);
  useEffect(() => {
    let count = 0;
    g.map((item) => (count = count + item.message_group_unread));
    setCountMessageGroup(count);
  }, [g]);

  return (
    <Fragment>
      <PreLoader isLoading={isLoading} />

      {sidebarPanel ? (
        <Fragment>
          {sidebarListChat ? (
            <Fragment>
              <Desktop>
                <div className="col-4 py-3 pe-3 vh-100 ">
                  <div className="col-12 d-flex ">
                    <div className="dropdown col-2 d-grid border border-1 rounded py-1 ">
                      <a className="col-12 dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image src={UsersProfile.picture === null || UsersProfile.picture === undefined ? "/assets/icons/ico-user.svg" : UsersProfile.picture} width="36px" height="36px" alt="" className="img-preview  py-0" />
                      </a>

                      <ul className="dropdown-menu mt-2">
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
                              await setSidebarCreateGroup(true);
                              await setSidebarDetailsGroup(false);
                            }}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-user-group" /> Create Group
                          </a>
                        </li>
                        <hr />
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
                              await setSideBarProfile(true);
                              //panel group
                              await setSidebarCreateGroup(false);
                              await setSidebarDetailsGroup(false);
                            }}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-user" className="me-2" />
                            Show Profile
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            <FontAwesomeIcon icon="fa-solid fa-circle-info" /> About us
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
                        <input className="form-control border-0 input-search text-secondary" id="input-search" type="search" placeholder="Search" aria-label="Search" onChange={handleSearch} />
                      </div>
                      <div className="col-2 d-flex justify-content-center ">
                        <Image src={IconSearch} width="18px" height="30px " alt="" className="py-0 " />
                      </div>
                    </div>
                  </div>

                  {sidebarListChatSearch ? (
                    <Fragment>
                      <div className="d-flex mt-2 py-0">
                        <hr className="w-50" />
                        <span className="mx-2 my-auto text-secondary">Users</span>
                        <hr className="w-50" />
                      </div>

                      <div id="plist" className="people-list side-scroll" style={{ maxHeight: "44%" }}>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                          {orderBy(u, [(item) => item.created_on], ["desc"])?.map((e) =>
                            (e?.email?.includes(keywordSearch) || e?.username?.includes(keywordSearch)) && e?.userID != id ? (
                              <Fragment key={e.id}>
                                <li
                                  className="d-flex align-items-center col-12"
                                  onClick={async () => {
                                    await handleSelectMessagePrivateId(e.id);
                                  }}
                                >
                                  <div className="col-2 d-flex align-items-center justify-content-center">
                                    <Image src={e.picture == null ? "/assets/icons/ico-user.svg" : e.picture} width="48px" height="48px" className="img-round" alt="" />
                                  </div>

                                  <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                    <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{e.name == null || e.name == undefined ? e.username : e.name}</span>
                                    <small className="">{e.email}</small>
                                  </div>
                                </li>
                              </Fragment>
                            ) : null
                          )}
                        </ul>
                      </div>

                      <div className="d-flex mt-2 py-0">
                        <hr className="w-50" />
                        <span className="mx-2 my-auto text-secondary">Group</span>
                        <hr className="w-50" />
                      </div>

                      <div id="plist" className="people-list side-scroll" style={{ maxHeight: "44%" }}>
                        <ul className="list-unstyled chat-list mb-0">
                          {orderBy(g, [(item) => item.created_on], ["desc"])?.map((e) =>
                            e.id.includes(keywordSearch) ? (
                              <Fragment key={e.id}>
                                <li
                                  className="d-flex align-items-center col-12"
                                  onClick={async () => {
                                    await handleSelectMessageGroupId(e.id);
                                  }}
                                >
                                  <div className="col-2 d-flex align-items-center justify-content-center">
                                    <Image src={e.group_logo == null ? "/assets/icons/ico-group.svg" : e.group_logo} width="48px" height="48px" className="img-round" alt="" />
                                  </div>

                                  <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                    <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{e.group_name == null || e.group_name == undefined ? e.id : e.group_name}</span>
                                    <small className="">Total Member : {e.group_member.length}</small>
                                  </div>
                                </li>
                              </Fragment>
                            ) : null
                          )}
                        </ul>
                      </div>
                    </Fragment>
                  ) : (
                    // label button list chat
                    <Fragment>
                      <div className="mt-3 d-flex justify-content-center align-items-center btn-group text-center justify-content-center" role="group">
                        <input type="radio" value="private-chat" name="radio-button-private-chat-group-chat" defaultChecked className="btn-check" id="private-chat" />
                        <label type="button" id="label-private-chat" className="btn btn-outline-info label-button-chat d-flex justify-content-center text-center my-auto" onClick={handleSwitchPrivateChat} htmlFor="private-chat">
                          <FontAwesomeIcon icon="fa-solid fa-user" className="my-auto" />
                          <span className="mx-2">Chat</span>
                          {countMessagePrivate == 0 ? null : (
                            <Fragment>
                              <span className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread-panel ">{countMessagePrivate}</span>
                            </Fragment>
                          )}
                        </label>

                        <input type="radio" value="group-chat" name="radio-button-private-chat-group-chat" className="btn-check" id="group-chat" />
                        <label type="button" id="label-group-chat" className="btn btn-outline-info  label-button-chat d-flex justify-content-center" onClick={handleSwitchGroupChat} htmlFor="group-chat">
                          <FontAwesomeIcon icon="fa-solid fa-user-group" className="my-auto" />
                          <span className="mx-2">Group</span>
                          {countMessageGroup == 0 ? null : (
                            <Fragment>
                              <span className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread-panel ">{countMessageGroup}</span>
                            </Fragment>
                          )}
                        </label>
                      </div>
                    </Fragment>
                  )}

                  {sidebarListChatPrivate ? (
                    <Fragment>
                      <div id="plist" className="people-list side-scroll mt-2" style={{ maxHeight: "88%" }}>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                          {orderBy(u, [(item) => item.messages[item.messages.length - 1]?.created_on], ["desc"])?.map((e) =>
                            e.userID != id && e.messages.length != 0 ? (
                              <Fragment key={e.id}>
                                <li
                                  className="col d-flex"
                                  onClick={async () => {
                                    await handleSelectMessagePrivateId(e.id);
                                  }}
                                >
                                  <div className="col-2 d-flex align-items-center justify-content-center img-bar-sidebar">
                                    <Image src={e.picture == null ? "/assets/icons/ico-user.svg" : e.picture} width="48px" height="48px" className="img-round" alt="" />
                                    {userOnline.some((value) => value == e.userID) ? (
                                      <Fragment>
                                        <span className="icon-online" />
                                      </Fragment>
                                    ) : (
                                      <Fragment>
                                        <span className="icon-offline" />
                                      </Fragment>
                                    )}
                                  </div>

                                  <div className="col-10 about my-0 align-items-center ps-2">
                                    <div className="col-12 d-flex">
                                      <span className="col-11 fs-6 fw-bold text-truncate ">{e.name == null || e.name == undefined ? (e.username == null || e.username == undefined ? e.email : e.username) : e.name}</span>
                                    </div>
                                    <div className="col-12 d-flex align-items-center">
                                      <small className="col-10 text-truncate ">{e.messages[e.messages.length - 1].content}</small>
                                      {e.messagesUnread == 0 ? null : (
                                        <Fragment>
                                          <div className="col-2 d-flex  justify-content-end align-items-center">
                                            <div className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread ">{e.messagesUnread}</div>
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
                    </Fragment>
                  ) : null}

                  {sidebarListChatGroup ? (
                    <Fragment>
                      <div id="plist" className="people-list side-scroll mt-2" style={{ maxHeight: "88%" }}>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                          {orderBy(g, [(item) => item.message_group[item.message_group.length - 1]?.created_on], ["desc"])?.map((e) =>
                            e?.group_member?.includes(id) ? (
                              <Fragment key={e.id}>
                                <li
                                  className="d-flex align-items-center col-12"
                                  onClick={async () => {
                                    await handleSelectMessageGroupId(e.id);
                                  }}
                                >
                                  <div className="col-2 d-flex align-items-center justify-content-center">
                                    <Image src={e.group_logo == null ? "/assets/icons/ico-group.svg" : e.group_logo} width="48px" height="48px" className="img-round" alt="" />
                                  </div>

                                  <div className="col-10 about my-0 ps-2">
                                    <span className="fs-6 fw-bold text-truncate align-items-start">{e.group_name}</span>
                                    <div className="col-12 d-flex align-items-start">
                                      <small className="col-10 text-truncate">
                                        {e.message_group[e.message_group.length - 1]?.content.includes(UsersProfile.username || UsersProfile.email)
                                          ? `You're ${e.message_group[e.message_group.length - 1]?.content?.split(UsersProfile.username || UsersProfile.email)[1]}`
                                          : e.message_group[e.message_group.length - 1]?.content}
                                      </small>

                                      {e.message_group_unread == 0 ? null : (
                                        <Fragment>
                                          <div className="col-2 d-flex  justify-content-end align-items-center">
                                            <div className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread">{e.message_group_unread}</div>
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
                    </Fragment>
                  ) : null}
                </div>

                {!messagePanel ? (
                  <Fragment>
                    <div className="col-8 border-start"></div>
                  </Fragment>
                ) : null}
              </Desktop>
              <Mobile>
                <div className="col-12 py-3 vh-100 ">
                  <div className="col-12 d-flex ">
                    <div className="dropdown col-1 d-grid border border-1 rounded py-1 ">
                      <a className="col-12 dropdown-toggle text-light d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image src={UsersProfile.picture === null || UsersProfile.picture === undefined ? "/assets/icons/ico-user.svg" : UsersProfile.picture} width="36px" height="36px" alt="" className="img-preview  py-0" />
                      </a>

                      <ul className="dropdown-menu mt-2">
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
                              await setSidebarCreateGroup(true);
                              await setSidebarDetailsGroup(false);
                            }}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-user-group" /> Create Group
                          </a>
                        </li>
                        <hr />
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
                              await setSideBarProfile(true);
                              //panel group
                              await setSidebarCreateGroup(false);
                              await setSidebarDetailsGroup(false);
                            }}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-user" className="me-2" />
                            Show Profile
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            <FontAwesomeIcon icon="fa-solid fa-circle-info" /> About us
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
                      <div className="col-11 text-secondary">
                        <input className="form-control border-0 input-search text-secondary" id="input-search" type="search" placeholder="Search" aria-label="Search" onChange={handleSearch} />
                      </div>
                      <div className="col-1 d-flex justify-content-center ">
                        <Image src={IconSearch} width="18px" height="30px " alt="" className="py-0 " />
                      </div>
                    </div>
                  </div>

                  {sidebarListChatSearch ? (
                    <Fragment>
                      <div className="d-flex mt-2 py-0">
                        <hr className="w-50" />
                        <span className="mx-2 my-auto text-secondary">Users</span>
                        <hr className="w-50" />
                      </div>

                      <div id="plist" className="people-list side-scroll" style={{ maxHeight: "44%" }}>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                          {orderBy(u, [(item) => item.created_on], ["desc"])?.map((e) =>
                            (e?.email?.includes(keywordSearch) || e?.username?.includes(keywordSearch)) && e?.userID != id ? (
                              <Fragment key={e.id}>
                                <li
                                  className="d-flex align-items-center col-12"
                                  onClick={async () => {
                                    await setSidebarPanel(false);
                                    await handleSelectMessagePrivateId(e.id);
                                  }}
                                >
                                  <div className="col-2 d-flex align-items-center justify-content-center">
                                    <Image src={e.picture == null ? "/assets/icons/ico-user.svg" : e.picture} width="48px" height="48px" className="img-round" alt="" />
                                  </div>

                                  <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                    <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{e.name == null || e.name == undefined ? e.username : e.name}</span>
                                    <small className="">{e.email}</small>
                                  </div>
                                </li>
                              </Fragment>
                            ) : null
                          )}
                        </ul>
                      </div>

                      <div className="d-flex mt-2 py-0">
                        <hr className="w-50" />
                        <span className="mx-2 my-auto text-secondary">Group</span>
                        <hr className="w-50" />
                      </div>

                      <div id="plist" className="people-list side-scroll" style={{ maxHeight: "44%" }}>
                        <ul className="list-unstyled chat-list mb-0">
                          {orderBy(g, [(item) => item.created_on], ["desc"])?.map((e) =>
                            e.id.includes(keywordSearch) ? (
                              <Fragment key={e.id}>
                                <li
                                  className="d-flex align-items-center col-12"
                                  onClick={async () => {
                                    await setSidebarPanel(false);
                                    await handleSelectMessageGroupId(e.id);
                                  }}
                                >
                                  <div className="col-2 d-flex align-items-center justify-content-center">
                                    <Image src={e.group_logo == null ? "/assets/icons/ico-group.svg" : e.group_logo} width="48px" height="48px" className="img-round" alt="" />
                                  </div>

                                  <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                    <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{e.group_name == null || e.group_name == undefined ? e.id : e.group_name}</span>
                                    <small className="">Total Member : {e.group_member.length}</small>
                                  </div>
                                </li>
                              </Fragment>
                            ) : null
                          )}
                        </ul>
                      </div>
                    </Fragment>
                  ) : (
                    // label button list chat
                    <Fragment>
                    <div className="mt-3 d-flex justify-content-center align-items-center btn-group text-center justify-content-center" role="group">
                      <input type="radio" value="private-chat" name="radio-button-private-chat-group-chat" defaultChecked className="btn-check" id="private-chat" />
                      <label type="button" id="label-private-chat" className="btn btn-outline-info label-button-chat d-flex justify-content-center text-center my-auto" onClick={handleSwitchPrivateChat} htmlFor="private-chat">
                        <FontAwesomeIcon icon="fa-solid fa-user" className="my-auto" />
                        <span className="mx-2">Chat</span>
                        {countMessagePrivate == 0 ? null : (
                          <Fragment>
                            <span className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread-panel ">{countMessagePrivate}</span>
                          </Fragment>
                        )}
                      </label>

                      <input type="radio" value="group-chat" name="radio-button-private-chat-group-chat" className="btn-check" id="group-chat" />
                      <label type="button" id="label-group-chat" className="btn btn-outline-info  label-button-chat d-flex justify-content-center" onClick={handleSwitchGroupChat} htmlFor="group-chat">
                        <FontAwesomeIcon icon="fa-solid fa-user-group" className="my-auto" />
                        <span className="mx-2">Group</span>
                        {countMessageGroup == 0 ? null : (
                          <Fragment>
                            <span className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread-panel ">{countMessageGroup}</span>
                          </Fragment>
                        )}
                      </label>
                    </div>
                  </Fragment>
                  )}

                  {sidebarListChatPrivate ? (
                    <Fragment>
                      <div id="plist" className="people-list side-scroll mt-2" style={{ maxHeight: "88%" }}>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                          {orderBy(u, [(item) => item.messages[item.messages.length - 1]?.created_on], ["desc"])?.map((e) =>
                            e.userID != id && e.messages.length != 0 ? (
                              <Fragment key={e.id}>
                                <li
                                  className="col d-flex"
                                  onClick={async () => {
                                    await setSidebarPanel(false);
                                    await handleSelectMessagePrivateId(e.id);
                                  }}
                                >
                                  <div className="col-1 d-flex align-items-center justify-content-center img-bar-sidebar">
                                    <Image src={e.picture == null ? "/assets/icons/ico-user.svg" : e.picture} width="48px" height="48px" className="img-round" alt="" />
                                    {userOnline.some((value) => value == e.userID) ? (
                                      <Fragment>
                                        <span className="icon-online" />
                                      </Fragment>
                                    ) : (
                                      <Fragment>
                                        <span className="icon-offline" />
                                      </Fragment>
                                    )}
                                  </div>

                                  <div className="col-11 about my-0 align-items-center ps-2">
                                    <div className="col-12 d-flex">
                                      <span className="col-11 fs-6 fw-bold text-truncate ">{e.name == null || e.name == undefined ? (e.username == null || e.username == undefined ? e.email : e.username) : e.name}</span>
                                    </div>
                                    <div className="col-12 d-flex align-items-center">
                                      <small className="col-10 text-truncate ">{e.messages[e.messages.length - 1].content}</small>
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
                    </Fragment>
                  ) : null}

                  {sidebarListChatGroup ? (
                    <Fragment>
                      <div id="plist" className="people-list side-scroll mt-2" style={{ maxHeight: "88%" }}>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                          {orderBy(g, [(item) => item.message_group[item.message_group.length - 1]?.created_on], ["desc"])?.map((e) =>
                            e?.group_member?.includes(id) ? (
                              <Fragment key={e.id}>
                                <li
                                  className="d-flex align-items-center col-12"
                                  onClick={async () => {
                                    await setSidebarPanel(false);
                                    await handleSelectMessageGroupId(e.id);
                                  }}
                                >
                                  <div className="col-1 d-flex align-items-center justify-content-center">
                                    <Image src={e.group_logo == null ? "/assets/icons/ico-group.svg" : e.group_logo} width="48px" height="48px" className="img-round" alt="" />
                                  </div>

                                  <div className="col-11 about my-0 ps-2">
                                    <span className="fs-6 fw-bold text-truncate align-items-start">{e.group_name}</span>
                                    <div className="col-12 d-flex align-items-start">
                                      <small className="col-10 text-truncate">
                                        {e.message_group[e.message_group.length - 1]?.content.includes(UsersProfile.username || UsersProfile.email)
                                          ? `You're ${e.message_group[e.message_group.length - 1]?.content?.split(UsersProfile.username || UsersProfile.email)[1]}`
                                          : e.message_group[e.message_group.length - 1]?.content}
                                      </small>

                                      {e.message_group_unread == 0 ? null : (
                                        <Fragment>
                                          <div className="col-2 d-flex  justify-content-end align-items-center">
                                            <div className="bg-danger rounded-pill  text-light d-flex justify-content-center align-items-center  icon-unread">{e.message_group_unread}</div>
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
                    </Fragment>
                  ) : null}
                </div>
              </Mobile>
            </Fragment>
          ) : null}
          {sidebarProfile ? (
            <Fragment>
              <Desktop>
                <div className=" col-4 py-3 pe-3 vh-100 side-scroll ">
                  <form onSubmit={handleUpdate}>
                    <div className="col-12 d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-outline-info px-3"
                        onClick={async () => {
                          //panel list chat
                          await setSideBarListChat(true);
                          await setSideBarListChatPrivate(true);
                          await setSideBarListChatGroup(false);
                          await setSidebarListChatSearch(false);
                          //panel profile
                          await setSideBarProfile(false);
                          //panel group
                          await setSidebarCreateGroup(false);
                          await setSidebarDetailsGroup(false);
                          setStatusEdit(false);
                          setBtnSave(false);
                          setBtnEdit(true);
                          setPreview();
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
                    <div className=" col-12 mt-5">
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
                {!messagePanel ? (
                  <Fragment>
                    <div className="col-8 border-start"></div>
                  </Fragment>
                ) : null}
              </Desktop>
              <Mobile>
                <div className="container-fluid col-12 py-3 vh-100 side-scroll">
                  <form onSubmit={handleUpdate}>
                    <div className="col-12 d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-outline-info px-3"
                        onClick={async () => {
                          //panel list chat
                          await setSideBarListChat(true);
                          await setSideBarListChatPrivate(true);
                          await setSideBarListChatGroup(false);
                          await setSidebarListChatSearch(false);
                          //panel profile
                          await setSideBarProfile(false);
                          //panel group
                          await setSidebarCreateGroup(false);
                          await setSidebarDetailsGroup(false);
                          setPreview();
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
                    <div className="col-12 mt-5">
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
          {sidebarCreateGroup ? (
            <Fragment>
              <Desktop>
                <div className="col-4 py-3 pe-3 vh-100 side-scroll ">
                  <form id="form-create-group" onSubmit={handleCreateGroup}>
                    <div className="col-12 d-flex justify-content-between">
                      <button
                        type="button"
                        id="btn-back-create-group"
                        className="btn btn-outline-info px-3"
                        onClick={async () => {
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
                          setNewLogoGroup();
                          setPreviewLogoGroup();

                          setDataGroup({ id: "", owner_id: id, group_name: "", group_logo: "", group_member: [id] });
                        }}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                        Back
                      </button>
                    </div>
                    <div className=" col-12 mt-5">
                      <div className="col-12 d-flex justify-content-center ">
                        <Image src={previewLogoGroup === null || previewLogoGroup === undefined ? "/assets/icons/ico-group.svg" : previewLogoGroup} width="210px" height="210px" className="img-preview" alt="" />
                      </div>
                      <div className="col-12 d-flex justify-content-center upload-btn-wrapper mb-5 mt-3">
                        <button type="button" className="btn btn-outline-secondary ">
                          <FontAwesomeIcon icon="fa-solid fa-camera" className="mx-2" />
                          Select Logo
                        </button>
                        <input className="form-control" type="file" id="formFile" name="group_logo" onChange={handleUploadGroup} />
                      </div>

                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />
                        </div>
                        <input className="form-control border-0  text-secondary" name="id" type="text" maxLength="16" placeholder="Id Group" aria-label="Id Group" onChange={handleChangeGroup} />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                        </div>
                        <input className="form-control border-0  text-secondary " name="group_name" type="text" maxLength="39" placeholder="Name Group" aria-label="Name Group" onChange={handleChangeGroup} />
                      </div>

                      <div className="col-12 mt-3">
                        <div className="col-12 d-grid">
                          <button type="submit" className="btn btn-info px-4 text-light">
                            <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Create Group
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                {!messagePanel ? (
                  <Fragment>
                    <div className="col-8 border-start"></div>
                  </Fragment>
                ) : null}
              </Desktop>
              <Mobile>
                <div className="container-fluid col-12 py-3 vh-100 side-scroll">
                  <form id="form-create-group" onSubmit={handleCreateGroup}>
                    <div className="col-12 d-flex justify-content-between">
                      <button
                        id="btn-back-create-group"
                        type="button"
                        className="btn btn-outline-info px-3"
                        onClick={async () => {
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
                          // if (size.width >= 992) {
                          document.getElementById("label-group-chat").click();
                          // }
                          setPreviewLogoGroup();
                          setDataGroup({ id: "", users_id: id, group_name: "", group_logo: "", group_member: [id] });
                          setStatusEdit(false);
                          setBtnSave(false);
                          setBtnEdit(true);
                        }}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                        Back
                      </button>
                    </div>
                    <div className=" col-12 mt-5">
                      <div className="col-12 d-flex justify-content-center ">
                        <Image src={previewLogoGroup === null || previewLogoGroup === undefined ? "/assets/icons/ico-group.svg" : previewLogoGroup} width="210px" height="210px" className="img-preview" alt="" />
                      </div>
                      <div className="col-12 d-flex justify-content-center upload-btn-wrapper mb-5 mt-3">
                        <button type="button" className="btn btn-outline-secondary ">
                          <FontAwesomeIcon icon="fa-solid fa-camera" className="mx-2" />
                          Select Logo
                        </button>
                        <input className="form-control" type="file" id="formFile" name="group_logo" onChange={handleUploadGroup} />
                      </div>

                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />
                        </div>
                        <input className="form-control border-0  text-secondary" name="id" type="text" placeholder="Id Group" aria-label="Id Group" onChange={handleChangeGroup} />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                        </div>
                        <input className="form-control border-0  text-secondary " name="group_name" type="text" placeholder="Name Group" aria-label="Name Group" onChange={handleChangeGroup} />
                      </div>

                      <div className="col-12 mt-3">
                        <div className="col-12 d-grid">
                          <button type="submit" className="btn btn-info px-4 text-light">
                            <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Create Group
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Mobile>
            </Fragment>
          ) : null}
          {sidebarDetailsGroup ? (
            <Fragment>
              {g.map((group) =>
                group.id == idMessage ? (
                  group.owner_id == id ? (
                    <Fragment key={group.id}>
                      <Desktop>
                        <div className="col-4 py-3 pe-3 vh-100  ">
                          <form id="form-edit-group" onSubmit={handleUpdateGroup}>
                            <div className="col-12 d-flex justify-content-between">
                              <button
                                type="button"
                                id="btn-back-edit-group"
                                className="btn btn-outline-info px-3"
                                onClick={async () => {
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

                                  setNewLogoGroup();
                                  setPreviewLogoGroup();
                                  setDataGroup({ id: "", owner_id: id, group_name: "", group_logo: "", group_member: [id] });
                                }}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                                Back
                              </button>
                            </div>
                            <div className=" col-12 mt-5">
                              <div className="col-12 d-flex justify-content-center ">
                                <Image
                                  src={previewLogoGroup === null || previewLogoGroup === undefined ? (group.group_logo === null || group.group_logo === undefined ? "/assets/icons/ico-group.svg" : group.group_logo) : previewLogoGroup}
                                  width="210px"
                                  height="210px"
                                  className="img-preview"
                                  alt=""
                                />
                              </div>
                              <div className="col-12 d-flex justify-content-center upload-btn-wrapper mb-5 mt-3">
                                <button type="button" className="btn btn-outline-secondary ">
                                  <FontAwesomeIcon icon="fa-solid fa-camera" className="mx-2" />
                                  Select Logo
                                </button>
                                <input className="form-control" type="file" id="formFile" name="group_logo" onChange={handleUploadGroup} />
                              </div>

                              <div className="d-flex align-items-center my-2">
                                <div className="col-2 d-flex align-items-center justify-content-center">
                                  <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />
                                </div>
                                <input
                                  className="form-control border-0  text-secondary"
                                  name="id"
                                  type="text"
                                  maxLength="16"
                                  placeholder="Id Group"
                                  aria-label="Id Group"
                                  onChange={handleChangeGroup}
                                  defaultValue={group.id}
                                  // disabled={statusEdit === true ? false : true}
                                />
                              </div>
                              <div className="d-flex align-items-center my-2">
                                <div className="col-2 d-flex align-items-center justify-content-center">
                                  <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                                </div>
                                <input
                                  className="form-control border-0  text-secondary "
                                  name="group_name"
                                  type="text"
                                  maxLength="39"
                                  placeholder="Name Group"
                                  aria-label="Name Group"
                                  onChange={handleChangeGroup}
                                  defaultValue={group.group_name}
                                  // disabled={statusEdit === true ? false : true}
                                />
                              </div>

                              <div className="col-12 mt-3">
                                <div className="col-12 d-flex justify-content-center">
                                  <button type="submit" className="btn btn-info px-2 text-light col-5 me-3">
                                    <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Edit Group
                                  </button>
                                  <button type="button" className="btn btn-danger px-2 text-light col-5" onClick={handleRemoveGroup}>
                                    <FontAwesomeIcon icon="fa-solid  fa-users-slash" className="me-2" /> Remove Group
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>

                          <div className="d-flex my-3 py-0 justify-content-center">
                            <hr className="w-25" />
                            <span className="mx-2 my-auto text-secondary">List Member</span>
                            <hr className="w-25" />
                          </div>
                          <div id="plist" className="people-list side-scroll" style={{ maxHeight: "38%" }}>
                            <ul className="list-unstyled chat-list  mb-0">
                              {group.group_member.map((member, index) => (
                                <Fragment key={index}>
                                  {u.map((user) =>
                                    user.id == member ? (
                                      user.id == id ? (
                                        <Fragment key={user.id}>
                                          <li className="d-flex align-items-center col-12">
                                            <div className="col-2 d-flex align-items-center justify-content-center">
                                              <Image src={user.picture == null ? "/assets/icons/ico-user.svg" : user.picture} width="48px" height="48px" className="img-round" alt="" />
                                            </div>

                                            <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                              <span className="fs-6 fw-bold text-truncate px-0 pb-0">
                                                {user.name == null || user.name == undefined ? user.username : user.name}
                                                <FontAwesomeIcon icon="fa-solid fa-crown" className="ms-1 icon-owner" />
                                              </span>
                                              <small className="text-truncate">{user.email}</small>
                                            </div>
                                          </li>
                                        </Fragment>
                                      ) : (
                                        <Fragment key={user.id}>
                                          <li className="d-flex align-items-center col-12">
                                            <div className="col-2 d-flex align-items-center justify-content-center">
                                              <Image src={user.picture == null ? "/assets/icons/ico-user.svg" : user.picture} width="48px" height="48px" className="img-round" alt="" />
                                            </div>

                                            <div className="col-9 about d-grid my-0 align-items-center ps-2">
                                              <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{user.name == null || user.name == undefined ? user.username : user.name}</span>
                                              <small className="">{user.email}</small>
                                            </div>
                                            <div className="col-1 d-flex justify-content-center">
                                              <button
                                                className="btn"
                                                onClick={() => {
                                                  leaveGroupAdmin(user.id);
                                                }}
                                              >
                                                <FontAwesomeIcon icon="fa-solid fa-user-minus" className="icon-remove-member-inside" />
                                                {}
                                              </button>
                                            </div>
                                          </li>
                                        </Fragment>
                                      )
                                    ) : null
                                  )}
                                </Fragment>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {!messagePanel ? (
                          <Fragment>
                            <div className="col-8 border-start"></div>
                          </Fragment>
                        ) : null}
                      </Desktop>
                      <Mobile>
                        <div className="container-fluid col-12 py-3 vh-100">
                          <form id="form-edit-group" onSubmit={handleUpdateGroup}>
                            <div className="col-12 d-flex justify-content-between">
                              <button
                                type="button"
                                id="btn-back-edit-group"
                                className="btn btn-outline-info px-3"
                                onClick={async () => {
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
                                  // if (size.width >= 992) {
                                  document.getElementById("label-group-chat").click();
                                  // }

                                  setNewLogoGroup();
                                  setPreviewLogoGroup();
                                  setDataGroup({ id: "", owner_id: id, group_name: "", group_logo: "", group_member: [id] });
                                }}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                                Back
                              </button>
                            </div>
                            <div className=" col-12 mt-5">
                              <div className="col-12 d-flex justify-content-center ">
                                <Image
                                  src={previewLogoGroup === null || previewLogoGroup === undefined ? (group.group_logo === null || group.group_logo === undefined ? "/assets/icons/ico-group.svg" : group.group_logo) : previewLogoGroup}
                                  width="210px"
                                  height="210px"
                                  className="img-preview"
                                  alt=""
                                />
                              </div>
                              <div className="col-12 d-flex justify-content-center upload-btn-wrapper mb-5 mt-3">
                                <button type="button" className="btn btn-outline-secondary ">
                                  <FontAwesomeIcon icon="fa-solid fa-camera" className="mx-2" />
                                  Select Logo
                                </button>
                                <input className="form-control" type="file" id="formFile" name="group_logo" onChange={handleUploadGroup} />
                              </div>

                              <div className="d-flex align-items-center my-2">
                                <div className="col-2 d-flex align-items-center justify-content-center">
                                  <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />
                                </div>
                                <input
                                  className="form-control border-0  text-secondary"
                                  name="id"
                                  type="text"
                                  maxLength="16"
                                  placeholder="Id Group"
                                  aria-label="Id Group"
                                  onChange={handleChangeGroup}
                                  defaultValue={group.id}
                                  // disabled={statusEdit === true ? false : true}
                                />
                              </div>
                              <div className="d-flex align-items-center my-2">
                                <div className="col-2 d-flex align-items-center justify-content-center">
                                  <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                                </div>
                                <input
                                  className="form-control border-0  text-secondary "
                                  name="group_name"
                                  type="text"
                                  maxLength="39"
                                  placeholder="Name Group"
                                  aria-label="Name Group"
                                  onChange={handleChangeGroup}
                                  defaultValue={group.group_name}
                                  // disabled={statusEdit === true ? false : true}
                                />
                              </div>

                              <div className="col-12 mt-3">
                                <div className="col-12 d-flex justify-content-center">
                                  <button type="submit" className="btn btn-info px-2 text-light col-5 me-3">
                                    <FontAwesomeIcon icon="fa-solid fa-user-pen" className="me-2" /> Edit Group
                                  </button>
                                  <button type="button" className="btn btn-danger px-2 text-light col-5" onClick={handleRemoveGroup}>
                                    <FontAwesomeIcon icon="fa-solid  fa-users-slash" className="me-2" /> Remove Group
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>

                          <div className="d-flex my-3 py-0 justify-content-center">
                            <hr className="w-25" />
                            <span className="mx-2 my-auto text-secondary">List Member</span>
                            <hr className="w-25" />
                          </div>

                          <div id="plist" className="people-list side-scroll" style={{ maxHeight: "38%" }}>
                            <ul className="list-unstyled chat-list  mb-0">
                              {group.group_member.map((member, index) => (
                                <Fragment key={index}>
                                  {u.map((user) =>
                                    user.id == member ? (
                                      user.id == id ? (
                                        <Fragment key={user.id}>
                                          <li className="d-flex align-items-center col-12">
                                            <div className="col-2 d-flex align-items-center justify-content-center">
                                              <Image src={user.picture == null ? "/assets/icons/ico-user.svg" : user.picture} width="48px" height="48px" className="img-round" alt="" />
                                            </div>

                                            <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                              <span className="fs-6 fw-bold text-truncate px-0 pb-0">
                                                {user.name == null || user.name == undefined ? user.username : user.name}
                                                <FontAwesomeIcon icon="fa-solid fa-crown" className="ms-1 icon-owner" />
                                              </span>
                                              <small className="text-truncate">{user.email}</small>
                                            </div>
                                          </li>
                                        </Fragment>
                                      ) : (
                                        <Fragment key={user.id}>
                                          <li className="d-flex align-items-center col-12">
                                            <div className="col-2 d-flex align-items-center justify-content-center">
                                              <Image src={user.picture == null ? "/assets/icons/ico-user.svg" : user.picture} width="48px" height="48px" className="img-round" alt="" />
                                            </div>

                                            <div className="col-9 about d-grid my-0 align-items-center ps-2">
                                              <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{user.name == null || user.name == undefined ? user.username : user.name}</span>
                                              <small className="">{user.email}</small>
                                            </div>
                                            <div className="col-1 d-flex justify-content-center">
                                              <button
                                                className="btn"
                                                onClick={() => {
                                                  leaveGroupAdmin(user.id);
                                                }}
                                              >
                                                <FontAwesomeIcon icon="fa-solid fa-user-minus" className="icon-remove-member-inside" />
                                                {}
                                              </button>
                                            </div>
                                          </li>
                                        </Fragment>
                                      )
                                    ) : null
                                  )}
                                </Fragment>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Mobile>
                    </Fragment>
                  ) : (
                    <Fragment key={group.id}>
                      <Desktop>
                        <div className="col-4 py-3 pe-3 vh-100  ">
                          <div className="col-12 d-flex justify-content-between">
                            <button
                              type="button"
                              className="btn btn-outline-info px-3"
                              onClick={async () => {
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

                                setNewLogoGroup();
                                setPreviewLogoGroup();
                                setDataGroup({ id: "", owner_id: id, group_name: "", group_logo: "", group_member: [id] });
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                              Back
                            </button>
                          </div>
                          <div className=" col-12 mt-5 ">
                            <div className="col-12 d-flex justify-content-center mb-5">
                              <Image
                                src={previewLogoGroup === null || previewLogoGroup === undefined ? (group.group_logo === null || group.group_logo === undefined ? "/assets/icons/ico-group.svg" : group.group_logo) : previewLogoGroup}
                                width="210px"
                                height="210px"
                                className="img-preview"
                                alt=""
                              />
                            </div>

                            <div className="d-flex align-items-center my-2">
                              <div className="col-2 d-flex align-items-center justify-content-center">
                                <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />
                              </div>
                              <input className="form-control border-0  text-secondary" name="id" type="text" maxLength="16" placeholder="Id Group" aria-label="Id Group" onChange={handleChangeGroup} defaultValue={group.id} disabled />
                            </div>
                            <div className="d-flex align-items-center my-2">
                              <div className="col-2 d-flex align-items-center justify-content-center">
                                <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                              </div>
                              <input
                                className="form-control border-0  text-secondary "
                                name="group_name"
                                type="text"
                                maxLength="39"
                                placeholder="Name Group"
                                aria-label="Name Group"
                                onChange={handleChangeGroup}
                                defaultValue={group.group_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="d-flex my-3 py-0 justify-content-center">
                            <hr className="w-25" />
                            <span className="mx-2 my-auto text-secondary">List Member</span>
                            <hr className="w-25" />
                          </div>

                          <div id="plist" className="people-list side-scroll" style={{ maxHeight: "38%" }}>
                            <ul className="list-unstyled chat-list  mb-0">
                              {group.group_member.map((member, index) => (
                                <Fragment key={index}>
                                  {u.map((user) =>
                                    user.id == member ? (
                                      <Fragment key={user.id}>
                                        <li className="d-flex align-items-center col-12">
                                          <div className="col-2 d-flex align-items-center justify-content-center">
                                            <Image src={user.picture == null ? "/assets/icons/ico-user.svg" : user.picture} width="48px" height="48px" className="img-round" alt="" />
                                          </div>

                                          <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                            <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{user.name == null || user.name == undefined ? user.username : user.name}</span>
                                            <small className="">{user.email}</small>
                                          </div>
                                        </li>
                                      </Fragment>
                                    ) : null
                                  )}
                                </Fragment>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {!messagePanel ? (
                          <Fragment>
                            <div className="col-8 border-start"></div>
                          </Fragment>
                        ) : null}
                      </Desktop>
                      <Mobile>
                        <div className="container-fluid col-12 py-3 vh-100">
                          <div className="col-12 d-flex justify-content-between">
                            <button
                              type="button"
                              className="btn btn-outline-info px-3"
                              onClick={async () => {
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
                                // if (size.width >= 992) {
                                document.getElementById("label-group-chat").click();
                                // }

                                setNewLogoGroup();
                                setPreviewLogoGroup();
                                setDataGroup({ id: "", owner_id: id, group_name: "", group_logo: "", group_member: [id] });
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-caret-left" className="me-2" />
                              Back
                            </button>
                          </div>
                          <div className=" col-12 mt-5 ">
                            <div className="col-12 d-flex justify-content-center mb-5">
                              <Image
                                src={previewLogoGroup === null || previewLogoGroup === undefined ? (group.group_logo === null || group.group_logo === undefined ? "/assets/icons/ico-group.svg" : group.group_logo) : previewLogoGroup}
                                width="210px"
                                height="210px"
                                className="img-preview"
                                alt=""
                              />
                            </div>

                            <div className="d-flex align-items-center my-2">
                              <div className="col-2 d-flex align-items-center justify-content-center">
                                <FontAwesomeIcon icon="fa-solid fa-user" className="text-secondary " />
                              </div>
                              <input className="form-control border-0  text-secondary" name="id" type="text" maxLength="16" placeholder="Id Group" aria-label="Id Group" onChange={handleChangeGroup} defaultValue={group.id} disabled />
                            </div>
                            <div className="d-flex align-items-center my-2">
                              <div className="col-2 d-flex align-items-center justify-content-center">
                                <FontAwesomeIcon icon="fa-solid fa-address-card" className="text-secondary " />
                              </div>
                              <input
                                className="form-control border-0  text-secondary "
                                name="group_name"
                                type="text"
                                maxLength="39"
                                placeholder="Name Group"
                                aria-label="Name Group"
                                onChange={handleChangeGroup}
                                defaultValue={group.group_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="d-flex my-3 py-0 justify-content-center">
                            <hr className="w-25" />
                            <span className="mx-2 my-auto text-secondary">List Member</span>
                            <hr className="w-25" />
                          </div>

                          <div id="plist" className="people-list side-scroll" style={{ maxHeight: "38%" }}>
                            <ul className="list-unstyled chat-list  mb-0">
                              {group.group_member.map((member, index) => (
                                <Fragment key={index}>
                                  {u.map((user) =>
                                    user.id == member ? (
                                      <Fragment key={user.id}>
                                        {/* <p>{user.name}</p> */}
                                        <li className="d-flex align-items-center col-12">
                                          <div className="col-2 d-flex align-items-center justify-content-center">
                                            <Image src={user.picture == null ? "/assets/icons/ico-user.svg" : user.picture} width="48px" height="48px" className="img-round" alt="" />
                                          </div>

                                          <div className="col-10 about d-grid my-0 align-items-center ps-2">
                                            <span className="fs-6 fw-bold text-truncate px-0 pb-0 ">{user.name == null || user.name == undefined ? user.username : user.name}</span>
                                            <small className="">{user.email}</small>
                                          </div>
                                        </li>
                                      </Fragment>
                                    ) : null
                                  )}
                                </Fragment>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Mobile>
                    </Fragment>
                  )
                ) : null
              )}
            </Fragment>
          ) : null}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default HomeChatPanelSideBar;
