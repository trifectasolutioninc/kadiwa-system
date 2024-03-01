import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const ScheduledDelivery = () => {
  const [date, setDate] = useState(new Date());
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const onChange = (date) => {
    setDate(date);
  };

  return (
    <>
      {/* <div className="bg-green-700 shadow-md top-0 fixed w-full">
        <div className="flex items-center gap-5 p-3">
          <NavLink to={"/main/profile"} className="">
            <IoMdArrowRoundBack className="text-white" fontSize={"25px"} />
          </NavLink>
          <h1 className="text-lg text-white font-bold">Setup Delivery Date</h1>
        </div>
      </div>
      <div className="flex flex-col items-center p-4 bg-green-200">
        <p className="text-lg font-bold mb-4 text-green-900">
          Choose a Delivery Date
        </p>
        <section className="border rounded-lg shadow-md p-4 w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white flex justify-center">
          <Calendar
            onChange={onChange}
            value={date}
            className="w-full"
            calendarType="gregory"
          />
        </section>
  </div> */}

      <div className="relative">
        {/* Navigation bar */}
        <div className="bg-green-700 shadow-md top-0 fixed w-full z-20">
          <div className="flex items-center gap-5 p-3">
            <NavLink to={"/main/profile"} className="">
              <IoMdArrowRoundBack className="text-white" fontSize={"25px"} />
            </NavLink>
            <h1 className="text-lg text-white font-bold">
              Setup Delivery Date
            </h1>
          </div>
        </div>

        {/* Overlay with "Coming Soon" text */}
        {isOverlayVisible && (
          <div className="fixed inset-0 bg-black opacity-70 z-10 flex items-center justify-center">
            <p className="text-4xl font-bold text-white z-60">Coming Soon</p>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col items-center p-4 bg-green-200">
          <p className="text-lg font-bold mb-4 text-green-900">
            Choose a Delivery Date
          </p>
          <section className="border rounded-lg shadow-md p-4 w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white flex justify-center">
            <Calendar
              onChange={onChange}
              value={date}
              className="w-full"
              calendarType="gregory"
            />
          </section>
        </div>
      </div>
    </>
  );
};

export default ScheduledDelivery;
