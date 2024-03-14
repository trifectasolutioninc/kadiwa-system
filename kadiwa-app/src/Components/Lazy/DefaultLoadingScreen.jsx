import React, { Suspense, lazy } from "react";
import { imageConfig } from "../../Configuration/config-file";

// Lazy load the modal component
const LazyModal = lazy(() => import("./ModalComponent"));

function DefaultLoadingScreen() {
  return (
    <Suspense fallback={null}>
      <LazyModal>
        <main className="flex items-center justify-center h-screen  bg-green-700 ">
          <div>
            <div className=" gap-5 ">
              <span class="relative flex ">
                <div className=" relative rounded-full p-3 z-40">
                  <img src={imageConfig.AppLogo} alt="" className="h-44 p-5 " />
                </div>
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
              </span>
            </div>

            {/* <div className="animate-spin rounded-full border-t-4 border-white border-opacity-70 size-14"></div> */}

            <h1 className="animate-pulse mt-52 text-lg font-bold text-white font-semibold text-center">
              Please wait...
            </h1>
          </div>
        </main>
      </LazyModal>
    </Suspense>
  );
}

export default DefaultLoadingScreen;
