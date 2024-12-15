"use client";
import React, { useEffect, useState } from "react";
import { useUserContext } from "~/app/context";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

import { getAllMovies } from "~/app/server-actions";
import { useRouter } from "next/navigation";

const MainPage = () => {
  const context = useUserContext();
  const router = useRouter();
  const [allMovies, setAllMovies] = useState([]);
  const [showingNow, setShowingNow] = useState(true); // State to track the current selection
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(true); // State to track movie fetching process

  async function fetchMovies() {
    try {
      setIsLoading(true);
      const movies = await getAllMovies();
      setAllMovies(movies);
      setFetchingMovies(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId === "" || !currentUserId) {
      router.push("../login-section");
    }
    void fetchMovies();
  }, []);

  const handleBuyClick = (movie) => {
    setIsLoading(true);
    context.setSelectedMovie(movie.id);
    router.push("../mainpage/seat-selection");
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.setItem("userId", "");
    router.push("/");
  };

  return (
    <div className="h-screen bg-gray-900 p-4 text-white">
      <h1 className="mb-4 text-2xl font-bold">Reservations</h1>
      <div className="space-y-4">
        <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          <Link href="../mainpage/user-reservations">
            Check your reservations
          </Link>
        </button>
        <button
          className="ml-3 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="mt-8 rounded-lg bg-gray-800 p-4">
        <h3 className="mb-2 text-lg font-semibold">Book a reservation</h3>

        {fetchingMovies ? (
          <div className="flex justify-center">
            <ClipLoader color="#4F46E5" size={35} />
          </div>
        ) : (
          <div className="mt-8 flex overflow-x-auto">
            {allMovies
              .filter((movie) => {
                const currentDate = new Date();
                const releaseDate = new Date(movie.release_date);
                return showingNow
                  ? releaseDate <= currentDate
                  : releaseDate > currentDate;
              })
              .map((movie, index) => (
                <div
                  key={index}
                  className={`relative mr-4 rounded-md bg-gray-700 p-4`}
                  style={{ width: "200px", height: "300px" }}
                >
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-gray-400">
                    Description: {movie.description}
                  </p>
                  <p className="text-gray-400">
                    Length: {movie.length} Minutes
                  </p>
                  <button
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    onClick={() => handleBuyClick(movie)}
                    disabled={isLoading}
                  >
                    {!isLoading ? (
                      "Buy"
                    ) : (
                      <ClipLoader color="white" size={20} />
                    )}
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
