import { Fragment } from "react";

import { useRouter } from "next/router";

import Image from "next/image";

const Costum404 = () => {
  const router = useRouter();

  return (
    <Fragment>
      <div className="page-not-found">
        <div className="container bg-white">
          <div className="col-12 justify-content-center text-center">
            <a
              className="d-flex justify-content-center mb-4"
              onClick={() => router.push("/")}
            >
              <Image
                src={"/assets/logo_colour.svg"}
                width="310px"
                height="78px"
                className="App-logo"
                alt=""
              />
            </a>
            <div className="d-flex justify-content-center ">
              <p className="fs-1 fw-bold text-info">404|</p>
              <p className="fs-1 fw-bold text-info">Page Not Found</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Costum404;
