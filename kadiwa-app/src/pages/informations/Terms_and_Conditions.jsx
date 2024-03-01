import React from "react";
import { NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Terms_and_Conditions = () => {
  return (
    <>
      <div className="fixed flex items-center gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 z-50 shadow-md">
        <div className="flex items-center gap-5 ">
          <NavLink to="/" className="">
            <IoMdArrowRoundBack
              fontSize={"25px"}
              className="text-neutral-100"
            />
          </NavLink>
        </div>
      </div>
      <div className="p-5 space-y-4 text-black/80 mt-16">
        <h1 className=" font-bold text-lg">Terms and Conditions</h1>
        <p className="leading-loose text-justify">
          Welcome to Kadiwa, a shopping app for commodities or essentials. These
          terms and conditions outline the rules and regulations for the use of
          Kadiwa's App.
        </p>
        <p className="leading-loose text-justify">
          By accessing this app we assume you accept these terms and conditions.
          Do not continue to use Kadiwa if you do not agree to take all of the
          terms and conditions stated on this page.
        </p>
        <p className="leading-loose text-justify">
          The following terminology applies to these Terms and Conditions,
          Privacy Statement and Disclaimer Notice and all Agreements: "Client",
          "You" and "Your" refers to you, the person log on this app and
          compliant to the Company’s terms and conditions. "The Company",
          "Ourselves", "We", "Our" and "Us", refers to our Company. "Party",
          "Parties", or "Us", refers to both the Client and ourselves. All terms
          refer to the offer, acceptance and consideration of payment necessary
          to undertake the process of our assistance to the Client in the most
          appropriate manner for the express purpose of meeting the Client’s
          needs in respect of provision of the Company’s stated services, in
          accordance with and subject to, prevailing law of Philippines. Any use
          of the above terminology or other words in the singular, plural,
          capitalization and/or he/she or they, are taken as interchangeable and
          therefore as referring to same.
        </p>
        <h2 className=" font-bold text-sm">Cookies</h2>
        <p className="leading-loose text-justify">
          We employ the use of cookies. By accessing Kadiwa, you agreed to use
          cookies in agreement with the Kadiwa's Privacy Policy.
        </p>
        <p className="leading-loose text-justify">
          Most interactive websites use cookies to let us retrieve the user’s
          details for each visit. Cookies are used by our app to enable the
          functionality of certain areas to make it easier for people visiting
          our app. Some of our affiliate/advertising partners may also use
          cookies.
        </p>
        <h2 className=" font-bold text-sm">License</h2>
        <p className="leading-loose text-justify">
          Unless otherwise stated, Kadiwa and/or its licensors own the
          intellectual property rights for all material on Kadiwa. All
          intellectual property rights are reserved. You may access this from
          Kadiwa for your own personal use subjected to restrictions set in
          these terms and conditions.
        </p>
        <p className="leading-loose text-justify">You must not:</p>
        <ul>
          <li>Republish material from Kadiwa</li>
          <li>Sell, rent or sub-license material from Kadiwa</li>
          <li>Reproduce, duplicate or copy material from Kadiwa</li>
          <li>Redistribute content from Kadiwa</li>
        </ul>
        <p className="leading-loose text-justify">
          This Agreement shall begin on the date hereof.
        </p>
        <h2 className=" font-bold text-sm">Disclaimer</h2>
        <p className="leading-loose text-justify">
          To the maximum extent permitted by applicable law, we exclude all
          representations, warranties and conditions relating to our app and the
          use of this app. Nothing in this disclaimer will:
        </p>
        <ul className="leading-loose text-justify">
          <li>
            limit or exclude our or your liability for death or personal injury;
          </li>
          <li>
            limit or exclude our or your liability for fraud or fraudulent
            misrepresentation;
          </li>
          <li>
            limit any of our or your liabilities in any way that is not
            permitted under applicable law; or
          </li>
          <li>
            exclude any of our or your liabilities that may not be excluded
            under applicable law.
          </li>
        </ul>
        <p className="leading-loose text-justify">
          The limitations and prohibitions of liability set in this Section and
          elsewhere in this disclaimer: (a) are subject to the preceding
          paragraph; and (b) govern all liabilities arising under the
          disclaimer, including liabilities arising in contract, in tort and for
          breach of statutory duty.
        </p>
        <p className="leading-loose text-justify">
          As long as the app and the information and services on the app are
          provided free of charge, we will not be liable for any loss or damage
          of any nature.
        </p>
        <h2 className=" font-bold text-sm">Change of Terms</h2>
        <p className="leading-loose text-justify">
          Kadiwa is permitted to revise these terms at any time as it sees fit,
          and by using this app you are expected to review these terms on a
          regular basis.
        </p>
        <h2 className=" font-bold text-sm">Assignment</h2>
        <p className="leading-loose text-justify">
          The Kadiwa is allowed to assign, transfer, and subcontract its rights
          and/or obligations under these Terms without any notification.
          However, you are not allowed to assign, transfer, or subcontract any
          of your rights and/or obligations under these Terms.
        </p>
        <h2 className=" font-bold text-sm">Entire Agreement</h2>
        <p className="leading-loose text-justify">
          These Terms constitute the entire agreement between Kadiwa and you in
          relation to your use of this app, and supersede all prior agreements
          and understandings.
        </p>
        <h2 className=" font-bold text-sm">Governing Law & Jurisdiction</h2>
        <p className="leading-loose text-justify">
          These Terms will be governed by and interpreted in accordance with the
          laws of the India, and you submit to the non-exclusive jurisdiction of
          the state and federal courts located in India for the resolution of
          any disputes.
        </p>
      </div>
    </>
  );
};

export default Terms_and_Conditions;
