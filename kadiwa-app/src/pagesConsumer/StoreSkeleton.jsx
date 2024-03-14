import React from "react";

function StoreSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="p-4 h-32 rounded-lg flex items-center justify-between gap-3 bg-slate-50 border"
          >
            <div className="animate-pulse space-y-2 w-full">
              <div className="bg-gray-300 w-2/4 p-3 rounded-md"></div>
              <div className="bg-gray-300 w-3/4 p-2 rounded-md"></div>
              <div className="bg-gray-300 w-1/4 p-2 rounded-md"></div>
            </div>
            <div className="bg-gray-300 w-1/6 p-4 rounded-md"></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default StoreSkeleton;
