import React from "react";
import { NavLink } from "react-router-dom";
import { foodCategory } from "../../Configuration/config-file";

function GoodsCluster() {
  return (
    <>
      <section className="p-1">
        <h1 className="text-xl text-black/80 font-bold mb-5 p-2 rounded-md tracking-widest">
          Categories
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {foodCategory.map((foods, index) => (
            <NavLink
              to={`/main/products-page/${foods.category.toLowerCase()}`}
              key={index}
              // className="w-full p-1 border bg-gradient-to-br from-lime-600 to-green-600 hover:bg-green-200 rounded-md shadow-md"
              className="w-full p-1 border bg-slate-50 hover:bg-green-200 rounded-md shadow-md"
            >
              {foods.pic && (
                <div className="flex justify-center">
                  <img
                    src={foods.pic}
                    alt={foods.category}
                    className="w-full h-44 md:h-72 rounded-md object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <h1 className="text-lg font-bold text-black/80 text-center p-4 tracking-widest">
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
