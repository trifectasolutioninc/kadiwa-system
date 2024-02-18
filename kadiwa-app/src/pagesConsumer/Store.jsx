import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LocationCityRounded,
  LocationOn,
  Notifications,
} from "@mui/icons-material";
import { ref, child, get } from "firebase/database";
import redirectToIndexIfNoConnect from "../Scripts/connections/check";
import configFirebaseDB from "../Configuration/config";
import BackButton from "./BackToHome";

const StoreConsumer = () => {
  const [storeList, setStoreList] = useState([]);
  const [storeAddressData, setStoreAddress] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, "store_information");
      const storeAddressRef = ref(database, "store_address_information");

      try {
        const storeSnapshot = await get(storeRef);
        const storeAddressSnapshot = await get(storeAddressRef);

        if (storeSnapshot.exists() && storeAddressSnapshot.exists()) {
          const stores = Object.values(storeSnapshot.val());
          const storeAddress = Object.values(storeAddressSnapshot.val());
          setStoreList(stores);
          setStoreAddress(storeAddress);
        } else {
          console.error("No stores found");
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <>
      <div className="fixed flex items-center gap-5 bg-white w-full top-0 p-3 right-0 left-0 shadow-md">
        <BackButton />
        <h1 className="text-xl text-green-600  font-bold">Store</h1>
      </div>
      <main className="p-3 md:p-10 space-y-5">
        {/* Top Navigation with Search and Notification */}
        <div className=" flex items-center justify-between bg-gray-100 mt-14">
          {/* Search Input */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border p-2 rounded-md bg-gray-300 text-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="container mb-16">
          {/* Store List */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {storeList.map(
              (store) =>
                // Conditionally render the container only for stores with 'usertype' as 'Partner'
                store.status === "open" && (
                  <Link
                    to={`/main/storepage/${store.id}`}
                    key={store.id}
                    className="bg-white p-4 rounded-lg shadow-md items-center grid grid-cols-10 border"
                  >
                    {/* <img src={store.logo} alt={`Store ${store.id} Logo`} className="mr-4 col-span-2" /> */}
                    <section className="col-span-9 text-left">
                      <p className="text-lg font-semibold">{store.name}</p>
                      <p className=" text-gray-500">{store.type}</p>
                      {storeAddressData.find(
                        (address) => address.id === store.id
                      ) && (
                        <p className=" text-gray-500">
                          <LocationOn fontSize="25px" />
                          {
                            storeAddressData.find(
                              (address) => address.id === store.id
                            ).city
                          }
                          ,{" "}
                          {
                            storeAddressData.find(
                              (address) => address.id === store.id
                            ).province
                          }
                        </p>
                      )}

                      <p className=" text-gray-500">Partner</p>
                    </section>
                    <div className="col-span-1 flex justify-end ">
                      <Link
                        to={`/main/storepage/${store.id}`}
                        className="text-center rounded-md bg-green-700 text-white px-4 py-2"
                      >
                        Visit
                      </Link>
                    </div>
                  </Link>
                )
            )}
          </section>
        </div>
        <h1 className="text-center text-black/80">-End of Page-</h1>
        <div className="p-8"></div>
      </main>
    </>
  );
};

export default StoreConsumer;
