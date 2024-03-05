import React from "react";
import { NavLink } from "react-router-dom";
import { foodCategory } from "../../Configuration/config-file";

function GoodsCluster() {
  return (
    <>
      <section className="p-1 space-y-3">
        <h1 className="text-xl text-black/80 font-bold rounded-md tracking-wide">
          Categories
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {foodCategory.map((foods, index) => (
            <NavLink
              to={`/main/products-page/${foods.category.toLowerCase()}`}
              key={index}
              //className="w-full p-1 border border-green-700 bg-slate-50 rounded-xl shadow-md"
              className=""
            >
              {foods.pic && (
                <div
                  //className="flex justify-center"
                  className="w-full p-2 border border-green-700 bg-slate-50 rounded-xl shadow-md"
                >
                  <img
                    src={foods.pic}
                    alt={foods.category}
                    className="w-full h-32 md:h-56 rounded-xl object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <h1 className="text-lg font-bold text-black/80 p-0.5 tracking-wide">
                {foods.category}
              </h1>
            </NavLink>
          ))}
        </div>
      </section>
    </>
  );
}

export default GoodsCluster;
