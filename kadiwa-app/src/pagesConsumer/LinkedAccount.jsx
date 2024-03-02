import React, { useEffect, useState } from "react";
import configFirebaseDB from "../Configuration/config";
import { paymentImg } from "../Configuration/config-file";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink } from "react-router-dom";

const LinkedAccount = () => {
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  // Sample data for different account types
  const sampleData = {
    MasterCard: {
      owner: "Juan Dela Cruz",
      number: "1234 5678 9123 4567",
      type: "MasterCard",
    },
    Gcash: {
      owner: "Juan Dela Cruz",
      number: "2468 1357 8024 6913",
      type: "Gcash",
    },
    Paymaya: {
      owner: "Juan Dela Cruz",
      number: "1357 2468 9132 8046",
      type: "Paymaya",
    },
    Bank: {
      owner: "Juan Dela Cruz",
      number: "7890 1234 5678 9012",
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
      case "Paymaya":
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
        <h1 className="text-xl text-neutral-100  font-bold">Linked Account</h1>
      </div>

      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black opacity-70 z-10 flex items-center justify-center">
          <p className="text-4xl font-bold text-white z-60">Coming Soon</p>
        </div>
      )}

      <main className="p-3 md:px-10 space-y-5 mt-14">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {linkedAccounts.map((account, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl border"
              >
                <div className="p-4 ">
                  <div className="grid grid-cols-10">
                    <img
                      src={getAccountImageSrc(account.type)}
                      alt={account.type}
                      className="w-10 h-10 object-contain col-span-3"
                    />
                    <div className=" col-span-7 items-center">
                      <p className="font-bold text-sm text-gray-700">
                        {account.owner}
                      </p>
                      <p className="font-bold text-xs text-gray-500">
                        {account.number}
                      </p>
                    </div>
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
              </div>
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
