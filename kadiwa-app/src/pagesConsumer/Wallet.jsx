import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink } from "react-router-dom";

function Wallet() {
  return (
    <>
      <section className="fixed flex items-center justify-between gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 z-10 shadow-md">
        <div className="flex items-center gap-5 ">
          <NavLink to={"/main/profile"}>
            <IoMdArrowRoundBack fontSize={"25px"} />
          </NavLink>
          <h1 className="text-xl text-neutral-100  font-bold">Load/Wallet</h1>
        </div>
      </section>
      <main className="p-3 md:p-10 space-y-5">
        <div className="mt-14">
          <section className="container border w-fit p-2 m-auto rounded-md">
            {" "}
            <h1 className="text-4xl font-bold text-black/80 text-center">
              QR CODE
            </h1>
          </section>
          <h1 className="text-xl font-bold text-black/80 text-center mt-5">
            Scan Me
          </h1>
        </div>

        <p className=" text-black/80 text-center">Or</p>

        <section className="flex flex-col gap-5 ">
          <button className="p-3 border rounded-md shadow-md">Gcash</button>
          <button className="p-3 border rounded-md shadow-md">Maya</button>
          <button className="p-3 border rounded-md shadow-md">MegaPay</button>
        </section>
      </main>
    </>
  );
}

export default Wallet;
