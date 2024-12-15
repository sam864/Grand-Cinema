"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import showLogo from "../icons/show.png";
import hideLogo from "../icons/hide.png";
import { useUserContext } from "~/app/context";
import { getAllUsers } from "~/app/server-actions";
import bcrypt from "bcryptjs";
const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useUserContext();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const handleLogin = async () => {
    try {
      if (email === "" || password === "") {
        setWarning("Fill all fields");
        return;
      }
      setIsLoading(true);
      const allUsers = await getAllUsers();
      let userFound = false;

      for (let i = 0; i < allUsers?.length; i++) {
        if (email === allUsers[i]?.email) {
          userFound = true;
          const isPasswordMatch = await bcrypt.compare(
            password,
            allUsers[i]?.password,
          ); // Compare hashed password
          if (isPasswordMatch) {
            context.setCurrentUser(allUsers[i]?.id);
            localStorage.setItem("userId", allUsers[i]?.id);
            setWarning("");
            setEmail("");
            setPassword("");
            router.push("../mainpage");
            break;
          } else {
            setWarning("Wrong password");
          }
        }
      }

      if (!userFound) {
        setWarning("Email not found");
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setWarning("Something went wrong");
      console.log("An error occurred while logging in:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-200">
      <div className="mt-10 w-96 rounded bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Login
        </h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
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
          <div className="relative">
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
            <Image
              src={isPasswordShown ? showLogo.src : hideLogo.src}
              onClick={() => setIsPasswordShown(!isPasswordShown)}
              width="20"
              height="24"
              alt="Show password"
              className="absolute right-3 top-9 max-h-8 max-w-8 cursor-pointer hover:scale-110"
            />
          </div>
          <div className="font-bold text-red-500">{warning}</div>
          <button
            className="focus:shadow-outline-blue w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-500 focus:outline-none disabled:opacity-50"
            onClick={async () => await handleLogin()}
            disabled={isLoading}
          >
            {!isLoading && <div>Login</div>}
            {isLoading && <ClipLoader color="white" size={20}></ClipLoader>}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-400">No account?</span>
          <Link
            href="../signup-section"
            className="ml-1 text-blue-400 hover:text-blue-500"
          >
            Sign up
          </Link>
        </div>
        <Link href="/">
          <div className="focus:shadow-outline-blue mt-4 flex w-14 justify-center rounded bg-gray-700 p-2 text-white hover:bg-gray-600 focus:outline-none">
            Back
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
