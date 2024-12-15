"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createAdmin, getAllAdmins } from "~/app/server-actions";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import showLogo from "../../icons/show.png";
import hideLogo from "../../icons/hide.png";
import Link from "next/link";
const AdminSignupPage = () => {
  const [accessId, setAccessId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [warning, setWarning] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const specialSymbols = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "=",
    "}",
    "{",
    "|",
    "_",
    '"',
    "-",
    ";",
    ";",
    "<",
    ">",
    "/",
    "?",
    ".",
    ",",
    "'",
    "[",
    "]",
    "`",
  ];
  const checkPasswordValidity = () => {
    if (password.length < 8) {
      setWarning("Password too short. It must contain at least 8 characters.");
      return false;
    }
    let specialSymbolCounter = 0;
    let numberCounter = 0;
    let capitalLetterCounter = 0;

    for (const char of password) {
      if (specialSymbols.includes(char)) {
        specialSymbolCounter++;
      } else if (!isNaN(parseInt(char))) {
        numberCounter++;
      } else if (char.toUpperCase() === char) {
        capitalLetterCounter++;
      }
    }
    if (
      capitalLetterCounter < 1 ||
      numberCounter < 1 ||
      specialSymbolCounter < 1
    ) {
      setWarning(
        "Invalid password. It must contain at least 1 capital letter, 1 special character, and 1 number.",
      );
      return false;
    }
    return true;
  };
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (accessId === "" || password === "" || confirmPassword === "") {
        setWarning("Fill all fields");
        return;
      }
      const allAdmins = await getAllAdmins();
      if (!allAdmins) return;
      for (let i = 0; i < allAdmins.length; i++) {
        if (accessId === allAdmins[i]?.access_id) {
          setWarning("Account already created for this access ID");
          return;
        }
      }

      if (!checkPasswordValidity()) return;
      if (confirmPassword !== password) {
        setWarning("Password and confirm password should be identical");
        return;
      }
      setIsLoading(true);

      const newAdmin = await createAdmin({
        accessId,
        password,
      });
      console.log("New admin:", newAdmin.data);
      setWarning("");
      router.push("../admin-section/login-section");
    } catch (error) {
      setIsLoading(false);
      setWarning("Invalid input");
      console.log("Error:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-200">
      <div className="w-full max-w-md rounded bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Sign Up
        </h1>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-400">
            Access ID
          </label>
          <input
            value={accessId}
            onChange={(e) => setAccessId(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your access ID"
          />
        </div>
        <div className="relative mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-400">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-700 p-2 pr-10 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            type={isPasswordShown ? "text" : "password"}
            placeholder="Enter your password"
          />
          <Image
            src={isPasswordShown ? showLogo.src : hideLogo.src}
            onClick={() => setIsPasswordShown(!isPasswordShown)}
            width="20"
            height="20"
            alt="Toggle password visibility"
            className="absolute right-3 top-10 cursor-pointer hover:scale-110"
          />
        </div>
        <div className="relative mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-400">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-700 p-2 pr-10 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            type={isConfirmPasswordShown ? "text" : "password"}
            placeholder="Confirm your password"
          />
          <Image
            src={isConfirmPasswordShown ? showLogo.src : hideLogo.src}
            onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
            width="20"
            height="20"
            alt="Toggle confirm password visibility"
            className="absolute right-3 top-10 cursor-pointer hover:scale-110"
          />
        </div>
        {warning && (
          <div className="mb-4 text-center font-bold text-red-500">
            {warning}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Link href="../admin-section">
            <button className="focus:shadow-outline flex items-center justify-center rounded bg-gray-700 px-4 py-2 font-semibold text-gray-200 hover:bg-gray-600 focus:outline-none">
              Back
            </button>
          </Link>
          <button
            onClick={async (e) => await handleSignup(e)}
            className="flex items-center justify-center rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-500 focus:outline-none"
          >
            {!isLoading ? (
              <span>Sign Up</span>
            ) : (
              <ClipLoader color="white" size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
