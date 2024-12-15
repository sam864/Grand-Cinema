"use client";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  getAllMovies,
  deleteMovie,
  getSpecifiedMovie,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [loadingStates, setLoadingStates] = useState({});
  const [warnings, setWarnings] = useState({}); // State to track warnings for each layout
  const context = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../../admin-section");
    async function fetchMovies() {
      try {
        const allMovies = await getAllMovies();
        if (!allMovies) {
          return;
        }
        const movieObjArr = allMovies.map((movie) => ({
          id: movie?.id,
          title: movie?.title,
          length: movie?.length,
          description: movie?.description,
          releaseDate: movie?.release_date,
          screeningArr: movie?.screenings,
        }));
        setMovies(movieObjArr);
        setLoading(false); // Set loading to false after movies are fetched
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  const handleDeleteMovie = async (movieId, index) => {
    try {
      setWarnings((prevWarnings) => ({
        ...prevWarnings,
        [movieId]: "", // Reset warning for the layout
      }));
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [movieId]: true, // Set loading state to true for the current deletion
      }));
      const movie = await getSpecifiedMovie(movieId);
      if (!movie) return;
      if (movie.screenings.length > 0) {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [movieId]: "Cannot delete movie. Currently in use.", // Set warning for the layout
        }));
        return;
      }
      await deleteMovie(movieId);
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId),
      );
    } catch (error) {
      console.error("Error deleting movie:", error);
    } finally {
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [movieId]: false, // Reset loading state after deletion is complete
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <ClipLoader color="#4F46E5" size={35} />
        </div>
      ) : (
        movies.map((movie) => (
          <div
            key={movie.id}
            className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-4"
          >
            <div className="text-lg font-bold">Title: {movie.title}</div>
            <div>Description: {movie.description}</div>
            <div>Length: {movie.length} minutes</div>
            <div>
              Release date: {new Date(movie.releaseDate).toLocaleDateString()}
            </div>
            {warnings[movie.id] && (
              <div className="font-bold text-red-500">{warnings[movie.id]}</div>
            )}
            <button
              onClick={() => handleDeleteMovie(movie.id)}
              disabled={loadingStates[movie.id]}
              className={`mt-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 ${
                loadingStates[movie.id] ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loadingStates[movie.id] ? (
                <ClipLoader color="white" size={20} />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        ))
      )}
      {movies.length === 0 && !loading && (
        <div className="text-center text-2xl font-bold text-white">
          There are no movies
        </div>
      )}
      <Link href="../movie">
        <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          Back
        </button>
      </Link>
    </div>
  );
};

export default MovieList;
