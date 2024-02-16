import React from "react";
import { NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function BackButton() {
  return (
    <>
      <NavLink to={"/main"} className="">
        <IoMdArrowRoundBack fontSize={"25px"} />
      </NavLink>
    </>
  );
}

export default BackButton;
