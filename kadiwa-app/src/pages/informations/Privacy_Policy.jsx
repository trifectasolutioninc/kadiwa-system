import React from "react";
import { NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
const PrivacyPolicy = () => {
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
        <h1 className="font-bold text-lg">Privacy Policy</h1>
        <p className="leading-loose text-justify">
          At Kadiwa, we prioritize the privacy of our users. This Privacy Policy
          document outlines the types of personal information we collect and how
          we use it.
        </p>
        <h1 className=" font-bold text-sm">Information Collection and Use</h1>
        <p className="leading-loose text-justify">
          Kadiwa may collect personal information from users in various ways,
          including when they register on the app, place an order, subscribe to
          our newsletter, respond to a survey, fill out a form, or interact with
          certain other activities or features we make available.
        </p>
        <p className="leading-loose text-justify">
          The personal information collected may include, but is not limited to:
          name, email address, mailing address, phone number, and payment
          information. Users may, however, visit our app anonymously. We will
          collect personal information from users only if they voluntarily
          submit such information to us.
        </p>
        <h1 className=" font-bold text-sm">Use of Collected Information</h1>
        <p className="leading-loose text-justify">
          Kadiwa may collect and use users' personal information for the
          following purposes:
        </p>
        <ul className="leading-loose text-justify">
          <li>To personalize user experience</li>
          <li>To improve our app</li>
          <li>To process transactions</li>
          <li>To send periodic emails</li>
        </ul>
        <p className="leading-loose text-justify">
          The email address users provide for order processing will only be used
          to send them information and updates pertaining to their order. It may
          also be used to respond to their inquiries, and/or other requests or
          questions. If a user decides to opt-in to our mailing list, they will
          receive emails that may include company news, updates, related product
          or service information, etc. If at any time the user would like to
          unsubscribe from receiving future emails, we include detailed
          unsubscribe instructions at the bottom of each email or the user may
          contact us via our app.
        </p>
        <h1 className=" font-bold text-sm">Protection of Information</h1>
        <p className="leading-loose text-justify">
          We adopt appropriate data collection, storage, and processing
          practices and security measures to protect against unauthorized
          access, alteration, disclosure, or destruction of users' personal
          information, username, password, transaction information, and data
          stored on our app.
        </p>
        <h2 className=" font-bold text-sm">Changes to This Privacy Policy</h2>
        <p className="leading-loose text-justify">
          Kadiwa has the discretion to update this privacy policy at any time.
          When we do, we will revise the updated date at the bottom of this
          page. We encourage users to frequently check this page for any changes
          to stay informed about how we are helping to protect the personal
          information we collect. You acknowledge and agree that it is your
          responsibility to review this privacy policy periodically and become
          aware of modifications.
        </p>
        <h1 className=" font-bold text-sm">Your Acceptance of These Terms</h1>
        <p className="leading-loose text-justify">
          By using Kadiwa, you signify your acceptance of this policy. If you do
          not agree to this policy, please do not use our app. Your continued
          use of the app following the posting of changes to this policy will be
          deemed your acceptance of those changes.
        </p>
        <h1 className=" font-bold text-sm">Contacting Us</h1>
        <p className="leading-loose text-justify">
          If you have any questions about this Privacy Policy, the practices of
          this app, or your dealings with this app, please contact us at:
        </p>
        <p className="leading-loose text-justify">Kadiwa App</p>
        <p className="leading-loose text-justify">contact@kadiwaapp.com</p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
