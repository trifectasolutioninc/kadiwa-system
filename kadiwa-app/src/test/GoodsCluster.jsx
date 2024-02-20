import React from "react";
import { BiSolidBowlRice } from "react-icons/bi";
import { foodCategory } from "../Configuration/config-file";

function GoodsCluster() {
  return (
    <>
      <section className="p-2">
        <h1 className="text-lg text-black/80 font-semibold my-2">Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {foodCategory.map((foods, index) => (
            <div
              key={index}
              className="w-full p-2 hover:bg-green-200 rounded-md shadow-md space-y-2"
            >
              {foods.pic && (
                <img
                  src={foods.pic}
                  alt={foods.category}
                  className="w-full h-28 md:h-44"
                />
              )}
              <h1 className="text-lg font-medium text-black/80 text-center">
                {foods.category}
              </h1>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default GoodsCluster;
