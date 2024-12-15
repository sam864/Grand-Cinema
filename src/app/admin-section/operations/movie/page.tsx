"use client";
import React, { useState, useEffect } from "react";
import { createMovie } from "~/app/server-actions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "~/app/context";
const MovieOperationsPage = () => {
  const [title, setTitle] = useState("");
  const [length, setLength] = useState<number>();
  const [releaseDate, setReleaseDate] = useState<string>();
  const [description, setDescription] = useState("");
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useUserContext();
  const router = useRouter();
  const handleCreateMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setMessage("");
      setIsLoading(true);
      if (
        title === undefined ||
        title === "" ||
        length === undefined ||
        releaseDate === undefined ||
        releaseDate === "" ||
        description === undefined ||
        description === ""
      ) {
        setWarning("Fill all fields");
        setIsLoading(false);
        return;
      }

      const newMovie = await createMovie({
        title,
        length,
        releaseDate,
        description,
      });

      setWarning("");
      setMessage("Movie created");
      console.log("New movie:", newMovie.data);
    } catch (error) {
      setWarning("An error occurred while creating movie");
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-8 shadow-xl">
        <h1 className="mb-8 text-center text-4xl font-semibold">
          Movie Operations
        </h1>

        <div className="rounded-lg bg-gray-700 p-6">
          <h3 className="mb-4 text-xl font-semibold">Create Movie</h3>
          <form className="space-y-4" onSubmit={handleCreateMovie}>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Movie Title:</label>
              <input
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Length:</label>
              <input
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                value={length}
                step={5}
                onChange={(e) => setLength(parseInt(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Movie Description:</label>
              <textarea
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Release Date:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={releaseDate}
                  onChange={(e) => {
                    if (!e) return;
                    setReleaseDate(e);
                  }}
                />
              </LocalizationProvider>
            </div>

            {warning && (
              <div className="mt-2 font-bold text-red-600">{warning}</div>
            )}
            {message && (
              <div className="mt-2 font-bold text-green-600">{message}</div>
            )}

            <button
              className="mt-4 w-full rounded-md bg-blue-600 py-2 font-semibold text-white focus:outline-none"
              type="submit"
              disabled={isLoading}
            >
              {!isLoading ? "Submit" : <ClipLoader color="white" size={20} />}
            </button>
          </form>

          <div className="mt-6 flex space-x-4">
            <button className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white focus:outline-none">
              <Link href="../operations/movie/movie-list">
                Check Movie List
              </Link>
            </button>
            <Link href="../operations">
              <div className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white focus:outline-none">
                Back
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieOperationsPage;
