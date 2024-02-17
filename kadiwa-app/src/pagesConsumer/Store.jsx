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

  useEffect(() => {
    const fetchStores = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, "store_information");

      try {
        const storeSnapshot = await get(storeRef);

        if (storeSnapshot.exists()) {
          const stores = Object.values(storeSnapshot.val());
          setStoreList(stores);
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
    <main className="p-3 md:p-10 bg-gray-100 space-y-5">
      <div className="flex items-center gap-5">
        <BackButton />
        <h1 className="text-xl text-green-600  font-bold">Store</h1>
      </div>
      {/* Top Navigation with Search and Notification */}
      <div className=" flex items-center justify-between bg-gray-100">
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
                  className="bg-white p-4 rounded-lg shadow-md items-center grid grid-cols-10"
                >
                  {/* <img src={store.logo} alt={`Store ${store.id} Logo`} className="mr-4 col-span-2" /> */}
                  <section className="col-span-9 text-left">
                    <p className="text-lg font-semibold">{store.name}</p>
                    <p className=" text-gray-500">{store.type}</p>
                    <p className=" text-gray-500">
                      <LocationOn fontSize="25px" /> Intramuros, City of Manila
                    </p>
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
    </main>
  );
};

export default StoreConsumer;
