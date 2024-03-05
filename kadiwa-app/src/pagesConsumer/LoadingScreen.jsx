import React from "react";

function LoadingScreen() {
  return (
    <>
      <main>
        <div className="flex items-center justify-center gap-5 h-screen bg-neutral-100">
          <div className="animate-spin rounded-full border-t-4 border-green-500 border-opacity-70 size-14"></div>
          <h1 className="text-lg text-black/80 font-semibold">
            Please wait...
          </h1>
        </div>
      </main>
    </>
  );
}

export default LoadingScreen;
