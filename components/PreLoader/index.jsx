import { Fragment } from "react";

const PreLoader = ({ isLoading }) => {
  return (
    <Fragment>
      {isLoading ? (
        <Fragment>
          <div className="preloader">
            <div className="loading">
              <div className="spinner-border text-info" style={{width: "3rem", height: "3rem"}} role="status"></div>
              {/* <div className="loader14">
                    <div className="loader-inner">
                        <div className="box-1"></div>
                        <div className="box-2"></div>
                        <div className="box-3"></div>
                        <div className="box-4"></div>
                    </div>
                    <span className="text">loading</span>
                </div> */}
            </div>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default PreLoader;
