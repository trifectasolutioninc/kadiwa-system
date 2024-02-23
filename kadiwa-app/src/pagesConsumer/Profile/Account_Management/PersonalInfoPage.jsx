import React, { useState, useEffect } from "react";
import { ref, child, get, getDatabase, update } from "firebase/database";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCalendar } from "react-icons/fa"; // Importing calendar icon
import { NavLink } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PersonalInfoPage = () => {
  const [userInformation, setUserInformation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Default value set to null
  const [selectedGender, setSelectedGender] = useState("N/A"); // Default value set to 'N/A'

  const uid = sessionStorage.getItem("uid");

  // Inside the useEffect hook
  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users_information/${uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserInformation(snapshot.val());
          const bdayValue = snapshot.val().bday;
          if (bdayValue) {
            const parsedDate = new Date(bdayValue);
            if (!isNaN(parsedDate.getTime())) {
              setSelectedDate(parsedDate);
            } else {
              console.error("Invalid date format:", bdayValue);
            }
          } else {
            setSelectedDate(null);
          }
          setSelectedGender(snapshot.val().gender || "N/A");
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInformation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    const dbRef = ref(getDatabase());
    update(child(dbRef, `users_information/${uid}`), userInformation)
      .then(() => {
        console.log("User information updated successfully");
      })
      .catch((error) => {
        console.error("Error updating user information: ", error);
      });
  };

  if (!userInformation) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-3 flex items-center gap-5 bg-green-700 border-b">
        <NavLink to={"/route/profileedit"}>
          <IoMdArrowRoundBack fontSize={"25px"} className="text-neutral-100" />
        </NavLink>
        <h1 className="text-lg text-neutral-100 font-bold">Edit Profile</h1>
        <div></div> {/* Placeholder for alignment */}
      </div>
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black/80 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="fullname"
            value={userInformation.fullname}
            onChange={handleInputChange}
            maxLength={35}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Birthday
          </label>
          <div className="relative border rounded w-full bg-white shadow">
            <div className="absolute top-0 right-0 m-3  text-gray-600 w-fit cursor-pointer">
              <FaCalendar
                onClick={() => document.getElementById("datepicker").click()}
              />
            </div>
            <DatePicker
              id="datepicker"
              className="appearance-none w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setUserInformation((prevState) => ({
                  ...prevState,
                  bday: date.toISOString().split("T")[0],
                }));
              }}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="gender"
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setUserInformation((prevState) => ({
                ...prevState,
                gender: e.target.value,
              }));
            }}
          >
            <option value="N/A">N/A</option> {/* Default value */}
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default PersonalInfoPage;
