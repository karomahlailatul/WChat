import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useDispatch } from "react-redux";
import { postSignUpUser } from "../../app/redux/Slice/SignUpUserSlice";

import { postSignIn } from "../../app/redux/Slice/SignInSlice";
import PreLoader from "../PreLoader";

import { toast } from "react-toastify";

const HomeAuth = ({ 
  // u, setU, token, 
  setToken, 
  // refreshToken, 
  setRefreshToken, 
  // sessionId, 
  setSessionId, 
  // id,
   setId }) => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
    email_username: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    await e.preventDefault();
    setIsLoading(true);
    if (document.getElementById("sign-in").checked) {
      await dispatch(postSignIn({ data }))
        .unwrap()
        .then((e) => {
          router.push("/");
          setToken(e.data.token);
          setRefreshToken(e.data.refreshToken);
          setId(e.data.id);
          setSessionId(e.data.session_id);
        });

      setIsLoading(false);
    } else if (document.getElementById("sign-up").checked) {
      if (data.confirm_password.match(data.password)) {
        if (document.getElementById("agree-user").checked) {
          await dispatch(postSignUpUser(data))
            .unwrap()
            .then((item) => {
              if (item?.statusCode === 201) {
                document.getElementById("sign-in").checked = true;
              }
            });
          setIsLoading(false);
        } else {
          toast.warning("Please Agree terms and conditions", { autoClose: 2000, toastId: "warningAgreeUser" });
        }
      } else {
        toast.warning("Password Not Match", { autoClose: 2000, toastId: "warningNotMatchPassword" });
      }
    }
  };

  const [toggle, setToggle] = useState(true);

  const [btnName, setBtnName] = useState("");

  const handleSwitchSignIn = () => {
    setToggle(true);
  };

  const handleSwitchSignUp = () => {
    setToggle(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (toggle) {
      setBtnName("Sign In");
    } else {
      setBtnName("Sign Up");
    }
  }, [toggle]);

  return (
    <Fragment>
      <PreLoader isLoading={isLoading} />
      {/* <div className="register-page">
        <div className="container"> */}
      <a className="d-flex justify-content-center mb-3" onClick={() => router.push("/")}>
        <Image src={"/assets/logo_colour.svg"} width="180px" height="60px" className="App-logo" alt="" />
      </a>
      <h5 className="text-center mb-3 text-info">Please sign up with your account</h5>
      <div className="mt-5">
        <form onSubmit={handleSubmit}>
          <div className="my-3 mb-3">
            <div className="mx-5 mb-5 d-flex justify-content-center align-items-center btn-group text-center justify-content-center" role="group">
              <input
                type="radio"
                value="sign-in"
                // onChange={handleChange}
                name="radio-button-sign-up-sign-in"
                defaultChecked
                className="btn-check"
                id="sign-in"
              />
              <label className="btn btn-outline-info label-button d-flex justify-content-center" onClick={handleSwitchSignIn} htmlFor="sign-in">
                Sign In
              </label>

              <input
                type="radio"
                value="sign-up"
                // onChange={handleChange}
                name="radio-button-sign-up-sign-in"
                className="btn-check"
                id="sign-up"
              />
              <label className="btn btn-outline-info  label-button d-flex justify-content-center" onClick={handleSwitchSignUp} htmlFor="sign-up">
                Sign Up
              </label>
            </div>

            <input className="form-control mt-3" id="email_username" type="text" placeholder="Email" name="email" value={data.email} onChange={handleChange} />

            <input className="form-control mt-3" id="_password" type="password" placeholder="Password" name="password" value={data.password} onChange={handleChange} />
          </div>
          <div id="sign-up" className="hide" style={{ display: toggle ? "none" : "block" }}>
            <input className="form-control mt-3 hidden-textbox" id="c_password" type="password" placeholder="Confirm Password" name="confirm_password" value={data.confirmPassword} onChange={handleChange} />
            <div className="d-flex justify-content-start my-2">
              <input className="form-check-input" type="checkbox" value="" id="agree-user" />
              <label className="form-check-label" htmlFor="agree-user">
                &nbsp;I agree to terms & conditions
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Link className="text-danger text-redirect" href="/reset-password">
              <a className="text-decoration-none text-info fw-bold ">Forgot password</a>
            </Link>
          </div>
          <div className="d-grid my-3">
            <button type="submit" className="btn btn-info btn-submit fw-bold text-light">
              {btnName}
            </button>
          </div>
        </form>
      </div>
      {/* </div>
      </div> */}
    </Fragment>
  );
};

export default HomeAuth;
