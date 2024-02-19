import React, { useEffect, useState } from "react";
import { imageConfig } from "../Configuration/config-file";
import configFirebaseDB from "../Configuration/config";
import { ref,  get } from "firebase/database";
import QRCode from "qrcode";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink } from "react-router-dom";

const Card = () => {
  const [userData, setUserData] = useState(null);
console.log(userData);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = sessionStorage.getItem("uid");
      const database = configFirebaseDB();
      const userRef = ref(database, `users_information/${uid}`);

      try {
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setUserData(userData);
          updateHTMLWithUserData(userData);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    const updateHTMLWithUserData = (userData) => {
      document.getElementById("cardid").innerText = userData.id.replace(
        /-/g,
        " "
      );
      document.getElementById("cardowner").innerText =
        userData.first_name + " " + userData.last_name;

      const qrCodeCanvas = document.getElementById("qrCodeCanvas");

      QRCode.toCanvas(
        qrCodeCanvas,
        userData.id,
        { width: 200, height: 200 },
        function (error) {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="fixed flex items-center gap-5 bg-white w-full top-0 p-3 right-0 left-0 z-10 shadow-md">
        <NavLink to={"/main/profile"}>
          <IoMdArrowRoundBack fontSize={"25px"} />
        </NavLink>
        <h1 className="text-xl font-bold  text-green-700">Card</h1>
      </div>
      <main className="p-3 md:px-10 space-y-5 mt-14">
        <div className="space-y-5 p-5 w-fit m-auto">
          <div className="relative max-w-md bg-cover bg-center rounded-lg overflow-hidden mx-auto">
            {/* Background Image */}
            <image
              src={imageConfig.cardbg}
              alt="Background Image"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-end">
              {/* Kadiwa Logo */}
              <image
                src={imageConfig.AppLogo}
                alt="Kadiwa Logo"
                className="h-16 w-16"
              />

              {/* Card Details */}
              <div className="text-white">
                <p id="cardid" className="text-lg font-semibold mb-2">
                  .... .... .... ....
                </p>
              </div>

              <div className="flex justify-between">
                {/* Card Owner Information */}
                <span id="cardowner" className="text-white text-xs">
                  ......
                </span>

                {/* Card Security Dots */}
                <span className="text-white">⬤ ⬤ ⬤</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-700 ">Kadiwa Card</p>
            <button className="border border-green-700 p-1 rounded-md text-xs text-green-700">
              Read More
            </button>
          </div>

          <div className="flex justify-center items-center p-5">
            <div className="text-center bg-white p-4 rounded-2xl text-black/80">
              {/* QR Code Title */}
              <h1 className="text-xl font-bold">QR Code</h1>

              {/* QR Code Canvas */}
              <canvas id="qrCodeCanvas" className="mx-auto"></canvas>

              <h1 className="text-md font-semibold">Scan Me</h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Card;
