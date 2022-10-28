// style component module
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "animate.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../node_modules/@fortawesome/fontawesome-svg-core/styles.css";

// style component
import "../components/PreLoader/style.css";
import "../components/PreLoaderComponent/style.css";
import "../components/HomePage/style.css";
import "../components/HomeChat/style.css";
import "../components/HomeChatPanelMessage/style.css";
import "../components/HomeChatPanelSideBar/style.css";
import "../components/HomeAuth/style.css";

import { useEffect, Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { wrapper } from "../app/redux/store";
import { Provider } from "react-redux";

import SSRProvider from "react-bootstrap/SSRProvider";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fas, fab, far);

const MyApp = ({ Component, 
  // id, token, refreshToken, sessionId,
   ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    document.title = "WChat | Chatting Everywhere";
  }, []);

  return (
    <Fragment>
      <SSRProvider>
        <Fragment>
          <Provider store={store}>
            <Component {...props.pageProps} />
          </Provider>
        </Fragment>
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover />
      </SSRProvider>
    </Fragment>
  );
};

export default MyApp;

// MyApp.getInitialProps = async ({ ctx }) => {
//   const token = ctx.req?.cookies?.token || null;
//   const refreshToken = ctx.req?.cookies?.refreshToken || null;
//   const id = ctx.req?.cookies?.id || null;
//   const sessionId = ctx.req?.cookies?.sessionId || null;

//   return {
//     token: token,
//     refreshToken: refreshToken,
//     id: id,
//     sessionId: sessionId,
//   };
// };
