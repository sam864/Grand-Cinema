"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useUserContext } from "~/app/context";

const AllOperationsPage = () => {
  const context = useUserContext();
  const router = useRouter();
  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../admin-section");
  }, []);
  const handleLogout = () => {
    localStorage.setItem("adminId", "");
    router.push("../admin-section");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
      <div className="w-full max-w-3xl rounded-lg bg-gray-800 p-8 shadow-xl">
        <h2 className="mb-8 bg-gradient-to-r bg-clip-text text-center text-4xl font-semibold  text-white">
          Admin Operations
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {/* Room Operations */}
          <Link href="../admin-section/operations/room">
            <button className="transform rounded-lg bg-blue-600  px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300">
              Room Operations
            </button>
          </Link>

          {/* Screening Operations */}
          <Link href="../admin-section/operations/screening">
            <button className="transform rounded-lg bg-blue-600  px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300">
              Screening Operations
            </button>
          </Link>

          {/* Movie Operations */}
          <Link href="../admin-section/operations/movie">
            <button className="transform rounded-lg bg-blue-600  px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300">
              Movie Operations
            </button>
          </Link>

          {/* Layout Operations */}
          <Link href="../admin-section/operations/layout">
            <button className="transform rounded-lg bg-blue-600  px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300">
              Layout Operations
            </button>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            className="transform rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllOperationsPage;
