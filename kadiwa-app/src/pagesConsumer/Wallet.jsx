import React, { useEffect, useState } from "react";
import { imageConfig } from "../Configuration/config-file";
import configFirebaseDB from "../Configuration/config";
import { ref, get } from "firebase/database";
import QRCode from "qrcode";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink } from "react-router-dom";

function Wallet() {
  const [userData, setUserData] = useState(null);

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
      <section className="fixed flex items-center justify-between gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 z-10 shadow-md">
        <div className="flex items-center gap-5 ">
          <NavLink to={"/main/profile"}>
            <IoMdArrowRoundBack
              fontSize={"25px"}
              className="text-neutral-100"
            />
          </NavLink>
          <h1 className="text-xl text-neutral-100  font-bold">Load/Wallet</h1>
        </div>
      </section>
      <main className="p-3 md:p-10 space-y-5">
        <div className="mt-14">
          <section className="container border w-fit p-2 m-auto rounded-md">
            <div className="text-center bg-white p-4 rounded-2xl text-black/80">
              {/* QR Code Title */}
              <h1 className="text-xl font-bold">QR Code</h1>

              {/* QR Code Canvas */}
              <canvas id="qrCodeCanvas" className="mx-auto"></canvas>

              <h1 className="text-md font-semibold">Scan Me</h1>
            </div>
          </section>
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
