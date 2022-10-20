import { Fragment } from "react";

import Image from "next/image";

import { wrapper } from "../../../app/redux/store";
import { getUsersProfile } from "../../../app/redux/Slice/UsersProfileSlice";

// import Cookies from "js-cookie";

import { connect } from "react-redux";
import nookies from "nookies";

export const getServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
  const { token, refreshToken } = nookies.get(ctx);

  await store.dispatch(getUsersProfile({ token, refreshToken }));

  return { props: {} };
});

const UsersProfile = () => {
  return (
    <Fragment>
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
                  src={
                    // recuiter.logo === null || recuiter.logo === undefined ?
                    "/assets/icons/ico-user.svg"
                    //   : recuiter.logo
                  }
                  alt=""
                />
              </div>
              <div className="col-xl-8 col-lg-8 col-md-6 col-sm-6 my-auto">
                <p className="my-auto fw-bold">{/* {recuiter.company} */}</p>

                <div
                  className="my-auto"
                  // onClick={() => setStatusEdit(true)}
                >
                  <input type="checkbox" className="btn-check" id="btn-check-2-outlined" autoComplete="off" />
                  <label className="" htmlFor="btn-check-2-outlined">
                    <Image referrerPolicy="no-referrer" width={15} height={15} layout="fixed" src={"/assets/icons/edit.svg"} alt="" />
                    <small>Change profile</small>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-12 my-xl-5 my-lg-5 mt-md-5 mt-sm-5">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="nav nav-pills d-grid" id="v-pills-tab" role="tablist" aria-orientation="horizontal">
                      <a className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="true">
                        {/* <img className="me-1" src="./assets/images/icons/my_account.svg" alt="i" /> */}
                        <span>My account</span>
                      </a>

                      <a className="nav-link" id="v-pills-address-tab" data-bs-toggle="pill" data-bs-target="#v-pills-address" type="button" role="tab" aria-controls="v-pills-address" aria-selected="true">
                        {/* <img className="me-1" src="./assets/images/icons/shipping.svg" alt="" /> */}
                        <span>Shipping Address</span>
                      </a>

                      <a className="nav-link" id="v-pills-order-tab" data-bs-toggle="pill" data-bs-target="#v-pills-order" type="button" role="tab" aria-controls="v-pills-order" aria-selected="true">
                        {/* <img className="me-1" src="./assets/images/icons/order.svg" alt="" /> */}
                        <span>My Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12  bg-light">
            <div className="container">
              <div className="col-12 w-auto bg-white mx-3 my-5 py-3 px-3">
                <div className="tab-content" id="v-pills-tabContent">
                  <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" data-toggle="button">
                    <div className="">
                      <div className="container-fluid">
                        <div className="col-12 justify-content-start">
                          <h4 className="modal-title fw-bold " id="modalProfileLabel">
                            My Profile
                          </h4>
                          <h6 className="text-muted my-2" id="modalProfileLabel">
                            Manage your profile information
                          </h6>
                        </div>
                        <hr />
                        <div className="col-12 d-xl-flex d-lg-flex flex-xl-row-reverse flex-lg-row-reverse d-md-grid d-sm-grid  my-3">
                          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="col-12 d-flex justify-content-center my-3">
                              {/* <img className="photo-profile" src="./assets/images/profile.jpg"
                                                            alt="profile" /> */}
                            </div>
                            <div className="col-12 d-flex justify-content-center">
                              <button type="button" className="btn btn-outline-secondary " data-bs-toggle="modal" data-bs-target="#modalAddress">
                                Select Image
                              </button>
                            </div>
                          </div>
                          <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="col-12 d-flex justify-content-start my-3">
                              <div className="col-5 d-flex justify-content-end ">
                                <label className="fs-6 text-muted form-label my-auto mx-5">Name</label>
                              </div>
                              <input type="name" className="form-control" id="exampleFormControlInput1" placeholder="" />
                            </div>
                            <div className="col-12 d-flex justify-content-start my-3">
                              <div className="col-5 d-flex justify-content-end ">
                                <label className="fs-6 text-muted form-label my-auto mx-5">Email</label>
                              </div>
                              <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                            </div>
                            <div className="col-12 d-flex justify-content-start my-3">
                              <div className="col-5 d-flex justify-content-end ">
                                <label className="fs-6 text-muted form-label my-auto mx-5">Phone Number</label>
                              </div>
                              <input type="phone" className="form-control" id="exampleFormControlInput1" placeholder="" />
                            </div>

                            <div className="col-12 d-flex justify-content-start my-3">
                              <div className="col-5 d-flex justify-content-end ">
                                <label className="fs-6 text-muted form-label my-auto mx-5">Gender</label>
                              </div>
                              <div className="col-6 d-flex justify-content-between">
                                <div className="form-check form-check-inline">
                                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                  <label className="form-check-label my-auto" htmlFor="inlineRadio1">
                                    Men
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                  <label className="form-check-label my-auto" htmlFor="inlineRadio2">
                                    Women
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 d-flex justify-content-start my-3">
                              <div className="col-5 d-flex justify-content-end ">
                                <label className="fs-6 text-muted form-label my-auto mx-5">Date of Birth</label>
                              </div>

                              <input className="form-control " type="date" id="start" name="date_of_birth" min="1920-01-01" max="2050-12-12" />
                            </div>
                            <div className="col-12 d-flex justify-content-center my-4">
                              <button type="button" className="btn-save-profile   " data-bs-toggle="modal" data-bs-target="#modalAddress">
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tab-pane fade show" id="v-pills-address" role="tabpanel" aria-labelledby="v-pills-address-tab" data-toggle="button">
                    <div className="my-5">
                      <div className="container-fluid">
                        <div className="col-12 justify-content-start ">
                          <h4 className="modal-title fw-bold" id="modalAddressLabel">
                            Choose another address
                          </h4>
                          <h6 className="text-muted my-2" id="modalAddressLabel">
                            Manage your shipping address
                          </h6>
                        </div>
                        <hr />
                        <div className="mx-5 mt-5 mb-4">
                          <div className="col-12 d-flex justify-content-center my-3 ">
                            <button className="btn-new-address col d-flex justify-content-center align-items-center text-center" data-bs-toggle="modal" data-bs-target="#modalNewAddress" data-bs-dismiss="modal" type="button">
                              <p className="text-muted my-auto">Add New Address</p>
                            </button>
                          </div>
                          <div className="col-12 justify-content-start mb-4">
                            <div className="list-group my-4">
                              <a href="#" data-bs-dismiss="modal" className="list-group-item list-group-item-action active my-3" aria-current="true">
                                <h5 className="my-2 mx-2">Andreas Jane</h5>
                                <h6 className="my-2 mx-2">
                                  <small>Perumahan Sapphire Mediterania, Wiradadi, Kec. Sokaraja, Kabupaten Banyumas, Jawa Tengah, 53181 [Tokopedia Note: blok c 16] Sokaraja, Kab. Banyumas, 53181</small>
                                </h6>
                                <button className="btn-change-address d-flex justify-content-start align-items-start text-start" data-bs-toggle="modal" data-bs-target="#modalChangeAddress" data-bs-dismiss="modal" type="link">
                                  <p className="fw-bold text-danger my-auto text-danger">Change Address</p>
                                </button>
                              </a>
                              <a href="#" data-bs-dismiss="modal" className="list-group-item list-group-item-action my-3" aria-current="true">
                                <h5 className="my-2 mx-2">Andreas Jule</h5>
                                <h6 className="my-2 mx-2">
                                  <small>Perumahan Sapphire Mediterania, Wiradadi, Kec. Sokaraja, Kabupaten Banyumas, Jawa Tengah, 53181 [Tokopedia Note: blok c 16] Sokaraja, Kab. Banyumas, 53181</small>
                                </h6>
                                <button className="btn-change-address d-flex justify-content-start align-items-start text-start" data-bs-toggle="modal" data-bs-target="#modalChangeAddress" data-bs-dismiss="modal" type="link">
                                  <p className="fw-bold text-danger my-auto text-danger">Change Address</p>
                                </button>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal fade" id="modalNewAddress" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalNewAddressLabel" aria-hidden="true">
                      <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                          <div className="modal-body">
                            <div className="container-fluid">
                              <div className="row">
                                <div className="col-12 d-flex justify-content-end ">
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="col-12 d-flex justify-content-center my-2">
                                  <h4 className="modal-title fw-bold " id="modalNewAddressLabel">
                                    Add new address
                                  </h4>
                                </div>
                                <div className="col-12 justify-content-center my-2 ">
                                  <label className="fs-6 text-muted form-label">Save address as (ex : home address, office address)</label>
                                  <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Rumah" />
                                </div>
                                <div className="col-12 d-flex justify-content-between my-2 ">
                                  <div className="col-6">
                                    <div className="col-11">
                                      <label className="fs-6 text-muted form-label">Recipient`s name</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="col-12">
                                      <label className="fs-6 text-muted form-label">Recipient`s telephone number</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 d-flex justify-content-between  my-2 ">
                                  <div className="col-6">
                                    <div className="col-11">
                                      <label className="fs-6 text-muted form-label">Address</label>
                                      <input type="email" className="form-control " id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="col-12">
                                      <label className="fs-6 text-muted form-label">Postal code</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 d-flex justify-content-between my-2 ">
                                  <div className="col-6">
                                    <div className="col-11">
                                      <label className="fs-6 text-muted form-label">City or Subdistrict</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 d-flex my-2">
                                  <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="customControlInline" />
                                    <label className="form-check-label mt-1 mb-1" htmlFor="customControlInline">
                                      Remember my preference
                                    </label>
                                  </div>
                                </div>
                                <div className="col-12 d-flex justify-content-end my-2">
                                  <div className="col-6 d-flex justify-content-center">
                                    <button className="btn-cancel-address  me-1 w-100" data-bs-toggle="modal" data-bs-target="#modalAddress" data-bs-dismiss="modal" type="button">
                                      Cancel
                                    </button>
                                    <button className="btn-save-address  ms-1 w-100" data-bs-toggle="modal" data-bs-target="#modalAddress" data-bs-dismiss="modal" type="button">
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal fade" id="modalChangeAddress" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalChangeAddressLabel" aria-hidden="true">
                      <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                          <div className="modal-body">
                            <div className="container-fluid">
                              <div className="row">
                                <div className="col-12 d-flex justify-content-end ">
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="col-12 d-flex justify-content-center my-2">
                                  <h4 className="modal-title fw-bold " id="modalChangeAddressLabel">
                                    Change address
                                  </h4>
                                </div>
                                <div className="col-12 justify-content-center my-2 ">
                                  <label className="fs-6 text-muted form-label">Save address as (ex : home address, office address)</label>
                                  <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Rumah" />
                                </div>
                                <div className="col-12 d-flex justify-content-between my-2 ">
                                  <div className="col-6">
                                    <div className="col-11">
                                      <label className="fs-6 text-muted form-label">Recipient`s name</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="col-12">
                                      <label className="fs-6 text-muted form-label">Recipient`s telephone number</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 d-flex justify-content-between  my-2 ">
                                  <div className="col-6">
                                    <div className="col-11">
                                      <label className="fs-6 text-muted form-label">Address</label>
                                      <input type="email" className="form-control " id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="col-12">
                                      <label className="fs-6 text-muted form-label">Postal code</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 d-flex justify-content-between my-2 ">
                                  <div className="col-6">
                                    <div className="col-11">
                                      <label className="fs-6 text-muted form-label">City or Subdistrict</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 d-flex my-2">
                                  <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="customControlInline" />
                                    <label className="form-check-label mt-1 mb-1" htmlFor="customControlInline">
                                      Remember my preference
                                    </label>
                                  </div>
                                </div>
                                <div className="col-12 d-flex justify-content-end my-2">
                                  <div className="col-6 d-flex justify-content-center">
                                    <button className="btn-cancel-address  me-1 w-100" data-bs-toggle="modal" data-bs-target="#modalAddress" data-bs-dismiss="modal" type="button">
                                      Cancel
                                    </button>
                                    <button className="btn-save-address  ms-1 w-100" data-bs-toggle="modal" data-bs-target="#modalAddress" data-bs-dismiss="modal" type="button">
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tab-pane fade show" id="v-pills-order" role="tabpanel" aria-labelledby="v-pills-order-tab" data-toggle="button">
                    <div className="row">
                      <div className="container-fluid container-nav-pills">
                        <div className="col-12 justify-content-start">
                          <h4 className="modal-title fw-bold " id="modalProfileLabel">
                            My Order
                          </h4>
                        </div>
                        <div className="nav d-flex-column nav-pills justify-content-start mt-2" id="v-pills-tab" role="tablist" aria-orientation="horizontal">
                          <a className="nav-link active" id="v-pills-allitem-tab" data-bs-toggle="pill" data-bs-target="#v-pills-allitem" type="button" role="tab" aria-controls="v-pills-allitem" aria-selected="true">
                            All items
                          </a>

                          <a className="nav-link" id="v-pills-notpaid-tab" data-bs-toggle="pill" data-bs-target="#v-pills-notpaid" type="button" role="tab" aria-controls="v-pills-notpaid" aria-selected="true">
                            {" "}
                            Not paid yet
                          </a>

                          <a className="nav-link" id="v-pills-packed-tab" data-bs-toggle="pill" data-bs-target="#v-pills-packed" type="button" role="tab" aria-controls="v-pills-packed" aria-selected="true">
                            {" "}
                            Packed
                          </a>

                          <a className="nav-link" id="v-pills-sent-tab" data-bs-toggle="pill" data-bs-target="#v-pills-sent" type="button" role="tab" aria-controls="v-pills-sent" aria-selected="true">
                            {" "}
                            Sent
                          </a>

                          <a className="nav-link" id="v-pills-completed-tab" data-bs-toggle="pill" data-bs-target="#v-pills-completed" type="button" role="tab" aria-controls="v-pills-completed" aria-selected="true">
                            Completed
                          </a>

                          <a className="nav-link" id="v-pills-cancel-tab" data-bs-toggle="pill" data-bs-target="#v-pills-cancel" type="button" role="tab" aria-controls="v-pills-cancel" aria-selected="true">
                            {" "}
                            Order Cancel
                          </a>
                        </div>
                        <hr />

                        <div className="tab-content" id="v-pills-tabContent">
                          <div className="tab-pane fade show active" id="v-pills-allitem" role="tabpanel" aria-labelledby="v-pills-allitem-tab" data-toggle="button">
                            <div className="vh-100">tab all item</div>
                          </div>

                          <div className="tab-pane fade show" id="v-pills-notpaid" role="tabpanel" aria-labelledby="v-pills-notpaid-tab" data-toggle="button">
                            <div className="vh-100">tab not paid</div>
                          </div>

                          <div className="tab-pane fade show" id="v-pills-packed" role="tabpanel" aria-labelledby="v-pills-packed-tab" data-toggle="button">
                            <div className="vh-100">tab picked</div>
                          </div>

                          <div className="tab-pane fade show" id="v-pills-sent" role="tabpanel" aria-labelledby="v-pills-sent-tab" data-toggle="button">
                            <div className="vh-100">tab sent</div>
                          </div>

                          <div className="tab-pane fade show" id="v-pills-completed" role="tabpanel" aria-labelledby="v-pills-completed-tab" data-toggle="button">
                            <div className="vh-100">tab completed</div>
                          </div>

                          <div className="tab-pane fade show" id="v-pills-cancel" role="tabpanel" aria-labelledby="v-pills-cancel-tab" data-toggle="button">
                            <div className="vh-100">tab order cancel</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default connect((state) => state)(UsersProfile);
