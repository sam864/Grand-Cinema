"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createUser, getAllUsers } from "~/app/server-actions";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import showLogo from "../icons/show.png";
import hideLogo from "../icons/hide.png";
import Link from "next/link";
const UserSignupPage = () => {
  const [email, setEmail] = useState("");
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
      if (email === "" || password === "" || confirmPassword === "") {
        setWarning("Fill all fields");
        return;
      }
      const allUsers = await getAllUsers();
      if (!allUsers) return;
      for (let i = 0; i < allUsers.length; i++) {
        if (email === allUsers[i]?.email) {
          setWarning("Account already created for this email");
          return;
        }
      }

      if (!checkPasswordValidity()) return;
      if (confirmPassword !== password) {
        setWarning("Password and confirm password should be identical");
        return;
      }
      setIsLoading(true);

      const newUser = await createUser({
        email,
        password,
      });
      setWarning("");
      router.push("../login-section");
    } catch (error) {
      setIsLoading(false);
      setWarning("Invalid input");
      console.log("Error:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-200">
      <div className="w-full max-w-md rounded bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-white">SIGN UP</h1>
        <div className="flex">
          <div className="mb-4 w-full">
            <label className="mb-2 block text-sm font-semibold text-gray-400">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              type="email"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="relative flex">
          <div className="mb-4 w-full">
            <label className="mb-2 block text-sm font-semibold text-gray-400">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              type={isPasswordShown ? "text" : "password"}
              placeholder="Enter your password"
            />
          </div>
          <Image
            src={isPasswordShown ? showLogo.src : hideLogo.src}
            onClick={() => setIsPasswordShown(!isPasswordShown)}
            width="20"
            height="25"
            alt="Show password"
            className="absolute right-3 top-9 max-h-8 max-w-8 cursor-pointer hover:scale-110"
          />
        </div>
        <div className="relative flex">
          <div className="mb-6 w-full">
            <label className="mb-2 block text-sm font-semibold text-gray-400">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              type={isConfirmPasswordShown ? "text" : "password"}
              placeholder="Confirm your password"
            />
          </div>
          <Image
            src={isConfirmPasswordShown ? showLogo.src : hideLogo.src}
            onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
            width="20"
            height="25"
            alt="Show confirm password"
            className="absolute right-3 top-9 max-h-8 max-w-8 cursor-pointer hover:scale-110"
          />
        </div>
        <div className="font-bold text-red-500">{warning}</div>
        <div className="mt-6 flex justify-between">
          <Link href="/">
            <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-gray-700 p-2 text-white hover:bg-gray-600 focus:outline-none">
              Back
            </div>
          </Link>
          <button
            onClick={async (e) => await handleSignup(e)}
            className="focus:shadow-outline-blue rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-500 focus:outline-none disabled:opacity-50"
          >
            {!isLoading && <div>Sign up</div>}
            {isLoading && <ClipLoader color="white" size={20}></ClipLoader>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSignupPage;
