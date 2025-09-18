import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSecretId } from "../components/SecretIdGenerator";

// ✅ Reusable Check Icon
const CheckIcon = () => (
  <svg
    className="h-8 w-8 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default function SelectionPage() {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const secretId = getSecretId(); // check secretId

  const handleProceed = () => {
    if (userType === "domestic") {
      navigate("/registerDomesticTourist");
    } else if (userType === "foreign") {
      navigate("/registerForeignTourist");
    }
  };

  // ✅ If secretId does not exist, block page
  if (!secretId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Access Denied
          </h2>
          <p className="text-gray-600 mt-2">
            Please scan the QR code or enter the valid keyword first.
          </p>
        </div>
      </div>
    );
  }

  // ✅ If secretId exists → show content
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-center text-slate-800">
          Choose Registration Type
        </h1>
        <p className="text-center text-slate-500 mt-2">
          Select one of the options below to continue.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Domestic */}
        <button
          type="button"
          onClick={() => setUserType("domestic")}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
            userType === "domestic"
              ? "bg-green-500 border-green-600 text-white shadow-lg"
              : "bg-slate-100 border-slate-200 hover:bg-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">Domestic Tourist</span>
            {userType === "domestic" && <CheckIcon />}
          </div>
        </button>

        {/* Foreign */}
        <button
          type="button"
          onClick={() => setUserType("foreign")}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
            userType === "foreign"
              ? "bg-green-500 border-green-600 text-white shadow-lg"
              : "bg-slate-100 border-slate-200 hover:bg-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">Foreign Tourist</span>
            {userType === "foreign" && <CheckIcon />}
          </div>
        </button>
      </div>

      {/* Proceed Button */}
      <div>
        <button
          type="button"
          onClick={handleProceed}
          disabled={!userType}
          className="w-full py-4 px-6 rounded-xl text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
