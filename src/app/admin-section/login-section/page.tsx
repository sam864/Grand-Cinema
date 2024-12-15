"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import showLogo from "../../icons/show.png";
import hideLogo from "../../icons/hide.png";
import { useUserContext } from "~/app/context";
import { getAllAdmins } from "~/app/server-actions";
import bcrypt from "bcryptjs"; // Import bcrypt

const LoginPage = () => {
  const router = useRouter();
  const [accessId, setAccessId] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useUserContext();
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminId", "");
  }, []);

  const handleLogin = async () => {
    try {
      if (accessId === "" || password === "") {
        setWarning("Fill all fields");
        return;
      }
      setIsLoading(true);
      const allAdmins = await getAllAdmins();

      if (!allAdmins) return;

      // Check if the admin exists and compare the password
      for (let i = 0; i < allAdmins?.length; i++) {
        if (accessId === allAdmins[i]?.access_id) {
          // Use bcrypt to compare the entered password with the stored hashed password
          const isPasswordValid = await bcrypt.compare(
            password,
            allAdmins[i]?.password,
          );

          if (isPasswordValid) {
            context.setCurrentAdmin(allAdmins[i]?.id);
            localStorage.setItem("adminId", allAdmins[i]?.id);
            setWarning("");
            setAccessId("");
            setPassword("");
            router.push("../admin-section/operations");
            break;
          } else {
            setWarning("Wrong password");
          }
        } else {
          setWarning("Access ID not found");
        }
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
            <label className="mb-2 text-sm font-semibold text-gray-400">
              Access ID
            </label>
            <input
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your access ID"
            />
          </div>
          <div className="relative">
            <div>
              <label className="mb-2 text-sm font-bold text-gray-400">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-700 bg-gray-700 p-2 pr-14 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                type={isPasswordShown ? "text" : "password"}
                placeholder="Enter your password"
              />
            </div>
            <Image
              src={isPasswordShown ? showLogo.src : hideLogo.src}
              onClick={() => setIsPasswordShown(!isPasswordShown)}
              width="20"
              height="24"
              alt="Show password"
              className="absolute right-2 top-9 cursor-pointer hover:scale-110"
            />
          </div>
          {warning && <div className="font-bold text-red-500">{warning}</div>}
          <button
            className="focus:shadow-outline-blue w-full rounded bg-blue-600 p-2 text-center text-white hover:bg-blue-500 focus:outline-none"
            onClick={async () => await handleLogin()}
            disabled={isLoading}
          >
            {!isLoading && <div>Login</div>}
            {isLoading && <ClipLoader color="white" size={20} />}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-400">No account?</span>
          <Link
            href="../admin-section/signup-section"
            className="ml-1 text-blue-500 hover:text-blue-400"
          >
            Sign up
          </Link>
        </div>
        <Link href="../admin-section">
          <div className="focus:shadow-outline-blue mt-4 flex w-14 justify-center rounded bg-gray-700 p-2 text-center text-white hover:bg-gray-600 focus:outline-none">
            Back
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
