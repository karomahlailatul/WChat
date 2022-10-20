import { Fragment } from "react";

const PreLoaderComponent = ({ isLoading }) => {
  return (
    <Fragment>
      {isLoading ? (
        <Fragment>
          <div className="d-flex justify-content-center align-items-center h-75 py-0">
            <div className="loader">
              <div className="loader-wheel"></div>
              <div className="loader-text"></div>
            </div>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default PreLoaderComponent;
