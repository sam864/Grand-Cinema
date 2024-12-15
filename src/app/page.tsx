"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllMovies } from "./server-actions";

const UserLandingPage = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [showingNow, setShowingNow] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAllMovies() {
      const movies = await getAllMovies();
      setAllMovies(movies);
    }
    fetchAllMovies();
  }, []);

  const handleToggle = () => {
    setShowingNow((prevState) => !prevState);
  };

  const handleMovieClick = () => {
    router.push("../login-section");
  };

  const filteredMovies = allMovies.filter((movie) => {
    const currentDate = new Date();
    const releaseDate = new Date(movie.release_date);
    return showingNow ? releaseDate <= currentDate : releaseDate > currentDate;
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-gray-200">
      <h1 className="mb-6 text-3xl font-semibold text-white">
        Welcome to Grand Cinema
      </h1>

      <div className="mb-8 flex">
        <button
          className={`mr-4 rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            showingNow
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          onClick={handleToggle}
        >
          Showing Now
        </button>
        <button
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            !showingNow
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          onClick={handleToggle}
        >
          Coming Soon
        </button>
      </div>

      {/* Display message if no movies available */}
      {filteredMovies.length === 0 ? (
        <p className="mt-4 text-xl text-gray-400">No movies available.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredMovies.map((movie, index) => (
            <div
              key={index}
              onClick={() => handleMovieClick()}
              className="movie-item cursor-pointer rounded-lg bg-gray-800 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {movie.title}
                </h3>
                <p className="mb-4 text-gray-400">{movie.description}</p>
                {!showingNow && (
                  <p className="text-sm text-gray-500">
                    Release date:{" "}
                    {new Date(movie.release_date).toLocaleDateString()}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Length: {movie.length} Minutes
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex w-full flex-col gap-4 sm:w-72">
        <Link href="../login-section">
          <button className="w-full rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-500">
            Login
          </button>
        </Link>
        <Link href="../signup-section">
          <button className="w-full rounded-full bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-500">
            Sign Up
          </button>
        </Link>
        <Link href="../admin-section">
          <button className="w-full rounded-full bg-gray-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-600">
            Go to Admin Section
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserLandingPage;
