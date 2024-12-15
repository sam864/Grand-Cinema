"use client";
import Link from "next/link";
import React from "react";

const AdminLandingPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Admin Section</h1>
        <p className="mt-2 text-gray-400">
          Login to access the dashboard or create a new account if you don't
          have one.(Using Your provided ID)
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <Link href="../admin-section/login-section">
          <button className="focus:shadow-outline rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 focus:outline-none">
            Login
          </button>
        </Link>
        <Link href="../admin-section/signup-section">
          <button className="focus:shadow-outline rounded bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500 focus:outline-none">
            Sign Up
          </button>
        </Link>
        <Link href="/">
          <button className="focus:shadow-outline rounded bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-600 focus:outline-none">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminLandingPage;
