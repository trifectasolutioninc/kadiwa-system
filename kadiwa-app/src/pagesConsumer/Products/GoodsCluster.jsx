import React from "react";
import { NavLink } from "react-router-dom";
import { foodCategory } from "../../Configuration/config-file";

function GoodsCluster() {
  return (
    <>
      <section className="p-2">
        <h1 className="text-xl text-white font-bold mb-5 bg-green-600 p-2 rounded-md tracking-widest">
          Categories
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {foodCategory.map((foods, index) => (
            <NavLink
              to={`/main/products-page/${foods.category.toLowerCase()}`}
              key={index}
              className="w-full bg-slate-50 hover:bg-green-200 rounded-md shadow-md border border-green-300"
            >
              {foods.pic && (
                <img
                  src={foods.pic}
                  alt={foods.category}
                  className="w-full h-28 md:h-64 rounded-md"
                />
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
