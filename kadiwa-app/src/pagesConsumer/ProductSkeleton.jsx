import React from "react";

function ProductSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="p-4 rounded-lg bg-slate-50 border">
            <div className="animate-pulse space-y-2">
              <div className="bg-gray-300 px-4 py-20 rounded-md"></div>
              <div className="bg-gray-300 w-2/4 p-2 rounded-md"></div>
              <div className="bg-gray-300 w-3/4 p-2 rounded-md"></div>
              <div className="bg-gray-300 w-2/4 p-2 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductSkeleton;
