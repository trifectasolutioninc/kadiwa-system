import React, { useEffect, useState } from "react";
import { paymentImg } from "../../../Configuration/config-file";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";

const LinkedAccount = () => {
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  // Sample data for different account types
  const sampleData = {
    Gcash: {
      control: "on",
      link: "https://m.gcash.com/gcash-login-web/index.html#/",
      type: "Gcash",
    },
    Maya: {
      control: "on",
      link: " ",
      type: "Maya",
    },
    MasterCard: {
      control: "on",
      link: " ",
      type: "MasterCard",
    },
    Bank: {
      control: "on",
      link: "",
      type: "Bank",
    },
  };

  // Fetch linked accounts when the component mounts
  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  // Function to fetch linked accounts
  const fetchLinkedAccounts = () => {
    // Simulate fetching from Firebase using sample data
    const accounts = Object.values(sampleData);
    setLinkedAccounts(accounts);
  };

  const getAccountImageSrc = (accountType) => {
    // Replace these paths with the actual paths to your images
    switch (accountType) {
      case "MasterCard":
        return `${paymentImg.MasterCard}`;
      case "Gcash":
        return `${paymentImg.Gcash}`;
      case "Maya":
        return `${paymentImg.Maya}`;
      case "Bank":
        return `${paymentImg.Bank}`;
      default:
        return `${paymentImg.Bank}`; // Provide a default image path
    }
  };

  return (
    <>
      <div className="fixed flex items-center gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 z-20 shadow-md">
        <NavLink to={"/main/profile"}>
          <IoMdArrowRoundBack fontSize={"25px"} className="text-neutral-100" />
        </NavLink>
        <h1 className="text-xl text-neutral-100  font-bold">
          All Payment Methods
        </h1>
      </div>

      {/* {isOverlayVisible && (
        <div className="fixed inset-0 bg-black opacity-70 z-10 flex items-center justify-center">
          <p className="text-4xl font-bold text-white z-60">Coming Soon</p>
        </div>
      )} */}

      <main className="p-3 md:px-10 space-y-5 mt-14">
        <div className="">
          <div className="text-right"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {linkedAccounts.map((account, index) => (
              <NavLink
                to={`/main/linked-account/${account.type}`}
                key={index}
                className="bg-white shadow-lg rounded-2xl border text-black/80 font-semibold"
              >
                <div className="p-4  flex items-center gap-4">
                  <div className="">
                    <img
                      src={getAccountImageSrc(account.type)}
                      alt={account.type}
                      className="w-10 h-10 object-contain col-span-3"
                    />
                  </div>

                  <span className="text-sm">{account.type}</span>

                  {/* Render additional information based on account type */}
                  {account.type === "MasterCard" && (
                    <span className="text-sm"></span>
                  )}
                  {account.type === "Gcash" && (
                    <span className="text-sm"></span>
                  )}
                  {account.type === "Paymaya" && (
                    <span className="text-sm"></span>
                  )}
                  {account.type === "Bank" && <span className="text-sm"></span>}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
        <h1 className="text-center text-black/80">-End of Page-</h1>
        <div className="p-8"></div>
      </main>
    </>
  );
};

export default LinkedAccount;
