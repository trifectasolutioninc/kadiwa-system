import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const EditPaymentMethod = () => {
  const sampleData = {
    Gcash: {
      control: "on",
      link: "https://m.gcash.com/gcash-login-web/index.html#/",
      type: "Gcash",
    },
    Maya: {
      control: "off",
      link: "",
      type: "Maya",
    },
    MasterCard: {
      control: "off",
      link: "",
      type: "MasterCard",
    },
    Bank: {
      control: "off",
      link: "",
      type: "Bank",
    },
  };

  const { paymentmethods } = useParams();
  const data = sampleData[paymentmethods];
  if (!data) {
    return <div>Data not found</div>;
  }
  const link = data.link;
  return (
    <>
      <div className="bg-green-700 shadow-md top-0 fixed w-full">
        <div className="flex items-center gap-5 p-3">
          <NavLink to={"/main/linked-account/"} className="">
            <IoMdArrowRoundBack
              fontSize={"25px"}
              className="text-neutral-100"
            />
          </NavLink>
          <h1 className="text-lg text-neutral-100 font-bold">
            {paymentmethods}
          </h1>
        </div>
      </div>
      {data.control === "on" ? (
        <div className="w-full h-screen">
          {link && (
            <iframe
              src={link}
              title="Edit Payment Method"
              className="w-full h-full mt-10"
            />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-white font-bold text-lg bg-black/70">
          <p className="text-center">Coming Soon</p>
        </div>
      )}
    </>
  );
};

export default EditPaymentMethod;
