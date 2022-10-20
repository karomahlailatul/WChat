import { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import { getUsersProfile } from "../../../app/redux/Slice/UsersProfileSlice";

// import { useRouter } from "next/router";

import UsersTabProfileMyProfile from "../../../components/UsersTabProfileMyProfile";

import UsersTabPortfolioCreatePortfolio from "../../../components/UsersTabPortfolioCreatePortfolio";
import UsersTabPortfolioEditPortfolio from "../../../components/UsersTabPortfolioEditPortfolio";
import UsersTabPortfolioMyPortfolio from "../../../components/UsersTabPortfolioMyPortfolio";

import UsersTabSkillCreateSkill from "../../../components/UsersTabSkillCreateSkill";
import UsersTabSkillEditSkill from "../../../components/UsersTabSkillEditSkill";
import UsersTabSkillMySkill from "../../../components/UsersTabSkillMySkill";

import UsersTabWorkExperienceCreateWorkExperience from "../../../components/UsersTabWorkExperienceCreateWorkExperience";
import UsersTabWorkExperienceEditWorkExperience from "../../../components/UsersTabWorkExperienceEditWorkExperience";
import UsersTabWorkExperienceMyWorkExperience from "../../../components/UsersTabWorkExperienceMyWorkExperience";

import UsersTabJobApplyMyJobApply from "../../../components/UsersTabJobApplyMyJobApply";

import PreLoader from "../../../components/PreLoader";

const UsersProfile = () => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  const [statusEdit, setStatusEdit] = useState(false);

  // const router = useRouter();
  const dispatch = useDispatch();

  const dispatchGetUsersProfile = async () => {
    await dispatch(getUsersProfile()).unwrap();
  };

  const { UsersProfile, isLoading } = useSelector((state) => state.UsersProfile);

  useEffect(() => {
    dispatchGetUsersProfile();
    setToken(Cookies.get("token"));
    setRefreshToken(Cookies.get("refreshToken"));
    setRole(Cookies.get("role"));
    setId(Cookies.get("id"));
  }, [dispatch, token, refreshToken, role, id]);

  return (
    <Fragment>
      <PreLoader isLoading={isLoading} />
      <div className="container container-profile-users">
        <div className="col-12 d-xl-flex d-lg-flex d-md-grid d-sm-grid">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 my-xl-5 my-lg-5 mt-md-5 mt-sm-5">
            <div className="col-12 d-flex mx-auto">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex justify-content-center logo-profile-middle">
                <Image
                  className="pictureThumbnails"
                  referrerPolicy="no-referrer"
                  width={60}
                  height={60}
                  layout="fixed"
                  src={UsersProfile.picture === null || UsersProfile.picture === undefined ? "/assets/icons/ico-user.svg" : UsersProfile.picture}
                  alt=""
                />
              </div>
              <div className="col-xl-8 col-lg-8 col-md-6 col-sm-6 my-auto">
                <p className="my-auto fw-bold mb-1">{UsersProfile.name}</p>

                <div
                  className="my-auto"
                  onClick={() => {
                    setStatusEdit(true);
                    // dispatchGetUsersProfile()
                  }}
                >
                  <input type="checkbox" className="btn-check" id="btn-check-2-outlined" autoComplete="off" />
                  <label className="" htmlFor="btn-check-2-outlined">
                    <Image referrerPolicy="no-referrer" width={15} height={15} layout="fixed" src={"/assets/icons/edit.svg"} alt="" />
                    <small className="ms-2">Change profile</small>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-12 my-xl-5 my-lg-5 mt-md-5 mt-sm-5">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <ul className="list-unstyled ps-0">
                      <div className="nav nav-pills d-grid" id="v-pills-tab" role="tablist" aria-orientation="horizontal">
                        <li className="mb-1">
                          <div className="d-flex justify-content-between ">
                            <button className="nav-link d-flex justify-content-start collapsed  " data-bs-toggle="collapse" data-bs-target="#recruiter-collapse" aria-expanded="true">
                              <div className=" me-3 ico-profile d-flex justify-content-center py-0 my-0">
                                {/* <img className="w-50" src={SellerProfileIcon} alt="" /> */}
                                {/* <Image
                                  referrerPolicy="no-referrer"
                                  width={18}
                                  height={18}
                                  layout="fixed"
                                  src={"/assets/icons/house-door.svg"}
                                  alt=""
                                  className=""
                                /> */}
                              </div>

                              <span className="label-sidebar my-auto">Users</span>
                            </button>
                            <button className=" btn-toggle rounded collapsed" data-bs-toggle="collapse" data-bs-target="#recruiter-collapse" aria-expanded="true"></button>
                          </div>

                          <div className="collapse show" id="recruiter-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                              <li>
                                <button href="#" className="nav-link rounded ms-5 active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="true">
                                  My Profile
                                </button>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="mb-1">
                          <div className="d-flex justify-content-between">
                            <button className="nav-link  d-flex justify-content-start collapsed " data-bs-toggle="collapse" data-bs-target="#portfolio-collapse" aria-expanded="false">
                              <div className=" me-3 ico-product d-flex justify-content-center">{/* <img className="w-50" src={SellerProductIcon} alt="" /> */}</div>
                              <label className="label-sidebar my-auto">Portfolio</label>
                            </button>
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#portfolio-collapse" aria-expanded="false"></button>
                          </div>

                          <div className="collapse" id="portfolio-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                              <li>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5"
                                  id="v-pills-my-portfolio-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-my-portfolio"
                                  type="button"
                                  role="tab"
                                  aria-controls="v-pills-my-portfolio"
                                  aria-selected="true"
                                >
                                  My Portfolio
                                </button>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5"
                                  id="v-pills-create-portfolio-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-create-portfolio"
                                  type="button"
                                  role="tab"
                                  aria-controls="v-pills-create-portfolio"
                                  aria-selected="true"
                                >
                                  Add a Portfolio
                                </button>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="mb-1">
                          <div className="d-flex justify-content-between">
                           
                            <button className="col nav-link d-flex justify-content-start text-start align-items-center" data-bs-toggle="collapse" data-bs-target="#work-experience-collapse" aria-expanded="false">
                              <div className="col-xl-12 col-lg-6  me-3 ico-order d-flex justify-content-center">{/* <img className="w-50" src={SellerOrderIcon} alt="" /> */}</div>
                              <span className="col-xl-12 col-lg-6 label-sidebar  ">Work Experience</span>
                            </button>
                           
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#work-experience-collapse" aria-expanded="false"></button>
                          </div>

                          <div className="collapse" id="work-experience-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small ">
                              <li>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5 d-flex justify-content-start "
                                  id="v-pills-my-work-experience-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-my-work-experience"
                                  type="button"
                                  role="tab"
                                  aria-controls="v-pills-my-work-experience"
                                  aria-selected="true"
                                >
                                  My Work Experience
                                </button>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5 ps-3 pe-0"
                                  id="v-pills-create-work-experience-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-create-work-experience"
                                  type="button"
                                  role="tab"
                                  aria-controls="#v-pills-create-work-experience"
                                  aria-selected="true"
                                >
                                  Add Work Experience
                                </button>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="mb-1">
                          <div className="d-flex justify-content-between">
                            <button className="nav-link  d-flex justify-content-start collapsed " data-bs-toggle="collapse" data-bs-target="#skill-collapse" aria-expanded="false">
                              <div className=" me-3 ico-order d-flex justify-content-center">{/* <img className="w-50" src={SellerOrderIcon} alt="" /> */}</div>
                              <span className="label-sidebar my-auto">Skill</span>
                            </button>
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#skill-collapse" aria-expanded="false"></button>
                          </div>

                          <div className="collapse" id="skill-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                              <li>
                                <button href="#" className="nav-link rounded ms-5" id="v-pills-my-skill-tab" data-bs-toggle="pill" data-bs-target="#v-pills-my-skill" type="button" role="tab" aria-controls="v-pills-my-skill" aria-selected="true">
                                  My Skill
                                </button>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5"
                                  id="v-pills-create-skill-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-create-skill"
                                  type="button"
                                  role="tab"
                                  aria-controls="#v-pills-create-skill"
                                  aria-selected="true"
                                >
                                  Add a Skill
                                </button>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="mb-1">
                          <div className="d-flex justify-content-between">
                            <button className="nav-link  d-flex justify-content-start collapsed " data-bs-toggle="collapse" data-bs-target="#job-apply-collapse" aria-expanded="false">
                              <div className=" me-3 ico-order d-flex justify-content-center">{/* <img className="w-50" src={SellerOrderIcon} alt="" /> */}</div>
                              <span className="label-sidebar my-auto">Job Apply</span>
                            </button>
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#job-apply-collapse" aria-expanded="false"></button>
                          </div>

                          <div className="collapse" id="job-apply-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                              <li>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5"
                                  id="v-pills-my-job-apply-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-my-job-apply"
                                  type="button"
                                  role="tab"
                                  aria-controls="v-pills-my-job-apply"
                                  aria-selected="true"
                                  onClick={() => {
                                    document.getElementById("v-pills-all-job-apply-tab").click();
                                  }}
                                >
                                  My Job Apply
                                </button>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5"
                                  id="#v-pills-approved-job-apply-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-my-job-apply"
                                  type="button"
                                  role="tab"
                                  aria-controls="#v-pills-my-job-apply"
                                  aria-selected="true"
                                  onClick={() => {
                                    document.getElementById("v-pills-approved-job-apply-tab").click();
                                  }}
                                >
                                  Approved Job
                                </button>
                                <button
                                  href="#"
                                  className="nav-link rounded ms-5"
                                  id="#v-pills-rejected-job-apply-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#v-pills-my-job-apply"
                                  type="button"
                                  role="tab"
                                  aria-controls="#v-pills-my-job-apply"
                                  aria-selected="true"
                                  onClick={() => {
                                    document.getElementById("v-pills-rejected-job-apply-tab").click();
                                  }}
                                >
                                  Rejected Job
                                </button>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12  bg-light">
            <div className="container">
              <div className="col-12 w-auto bg-white mx-3 my-5 py-3 px-3">
                <div className="tab-content" id="v-pills-tabContent">
                  <UsersTabProfileMyProfile
                    UsersProfile={UsersProfile}
                    statusEdit={statusEdit}
                    setStatusEdit={setStatusEdit}
                    dispatchGetUsersProfile={dispatchGetUsersProfile}
                    token={token}
                    refreshToken={refreshToken}
                    role={role}
                    id={id}
                    isLoading={isLoading}
                  />

                  <UsersTabPortfolioCreatePortfolio />
                  <UsersTabPortfolioEditPortfolio />
                  <UsersTabPortfolioMyPortfolio />

                  <UsersTabSkillCreateSkill />
                  <UsersTabSkillEditSkill />
                  <UsersTabSkillMySkill />

                  <UsersTabWorkExperienceCreateWorkExperience />
                  <UsersTabWorkExperienceEditWorkExperience />
                  <UsersTabWorkExperienceMyWorkExperience />

                  <UsersTabJobApplyMyJobApply />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersProfile;
