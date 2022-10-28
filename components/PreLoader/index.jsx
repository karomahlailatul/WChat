import { Fragment } from "react";

const PreLoader = ({ isLoading }) => {
  return (
    <Fragment>
      {isLoading ? (
        <Fragment>
          <div className="preloader">
            <div className="loading">
              <div className="spinner-border text-info" style={{width: "3rem", height: "3rem"}} role="status"></div>
            </div>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default PreLoader;
