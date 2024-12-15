"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import dayjs from "dayjs";
import {
  createScreening,
  getAllCinemaRooms,
  getAllMovies,
  getSpecifiedRoom,
  getAllRoomScreenings,
  getSpecifiedMovie,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const ScreeningOperationsPage = () => {
  const cinemaId = "677cd70b-e1b5-48fc-a6a9-0dadd71775c8";
  const context = useUserContext();
  const router = useRouter();
  const [roomId, setRoomId] = useState();
  const [movieId, setMovieId] = useState();
  const [screeningTime, setScreeningTime] = useState();
  const [roomOptions, setRoomOptions] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seatPrice, setSeatPrice] = useState();
  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getAllCinemaRooms(cinemaId);
      if (rooms === undefined) return;
      const roomArr = [];
      rooms.map((room) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        roomArr?.push({ label: room.number, value: room.id });
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setRoomOptions(roomArr);
    }

    async function fetchMovies() {
      const movies = await getAllMovies();
      if (movies === undefined) return;

      const currentDate = new Date();

      const movieArr = movies
        .filter((movie) => {
          // Convert movie release date to Date object
          const releaseDate = new Date(movie.release_date);

          // Include movie if release date is today or in the past
          return releaseDate <= currentDate;
        })
        .map((movie) => {
          return { label: movie.title, value: movie.id };
        });

      setMovieOptions(movieArr);
    }

    void fetchRooms();
    void fetchMovies();
  }, []);

  const checkTimeConflict = async () => {
    const roomScreenings = await getAllRoomScreenings(roomId);
    const movie = await getSpecifiedMovie(movieId);
    const movieLengthInMinutes = movie?.length;

    if (!screeningTime || !roomScreenings) return false;

    const currentScreeningStart = new Date(screeningTime);
    const currentScreeningEnd = new Date(
      currentScreeningStart.getTime() + movieLengthInMinutes * 60000,
    );

    for (const roomScreening of roomScreenings) {
      const reservedScreeningStart = new Date(roomScreening.screening_time);
      const reservedScreeningMovie = await getSpecifiedMovie(
        roomScreening.movieId,
      );

      if (!reservedScreeningMovie) continue;

      const reservedScreeningEnd = new Date(
        reservedScreeningStart.getTime() +
          reservedScreeningMovie.length * 60000,
      );

      // Check if the new screening overlaps with any existing screening
      if (
        currentScreeningStart < reservedScreeningEnd &&
        currentScreeningEnd > reservedScreeningStart
      ) {
        console.log(
          "TIME CONFLICT: New screening overlaps with an existing screening.",
        );
        return true;
      }

      // Check if the new screening starts before any existing screening
      if (
        currentScreeningStart < reservedScreeningStart &&
        currentScreeningEnd > reservedScreeningStart
      ) {
        console.log(
          "TIME CONFLICT: New screening starts before an existing screening ends.",
        );
        return true;
      }
    }
    return false;
  };

  const handleCreateScreening = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setMessage("");
      setIsLoading(true);
      if (
        roomId === undefined ||
        roomId === "" ||
        movieId === undefined ||
        movieId === "" ||
        screeningTime === undefined ||
        screeningTime === "" ||
        seatPrice === undefined ||
        seatPrice === ""
      ) {
        setWarning("Fill all fields");
        setIsLoading(false);
        return;
      }
      const room = await getSpecifiedRoom(roomId);
      if (!room) return;
      const timeConflict = await checkTimeConflict();
      if (timeConflict === true) {
        setWarning("Time conflict with another screening");
        setIsLoading(false);
        return;
      }
      const newScreening = await createScreening({
        roomId,
        movieId,
        screeningTime,
        availableSeats: room.capacity,
        seatPrice,
      });
      setIsLoading(false);
      console.log("New screening :", newScreening.data);
      setWarning("");
      setMessage("Screening created");
    } catch (error) {
      setIsLoading(false);
      setWarning("An error occured while creating screening");
      console.log("Error:", error);
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
        <h1 className="mb-8 bg-clip-text text-center text-4xl font-semibold text-white">
          Screening Operations
        </h1>

        <div className="rounded-lg bg-gray-700 p-6">
          <h3 className="mb-4 text-xl font-semibold text-white">
            Create Screening
          </h3>
          <form
            className="space-y-4"
            onSubmit={async (e) => await handleCreateScreening(e)}
          >
            {/* Room Selector */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Select Room:</label>
              <Select
                options={roomOptions}
                onChange={(e) => setRoomId(e.value)}
                className="rounded-md bg-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "#4b5563", // Match background color
                    color: "#f9fafb", // Ensure text color is white
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: "#f9fafb",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: "#4b5563",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#6366f1"
                      : state.isFocused
                        ? "#4b5563"
                        : undefined,
                    color: state.isSelected ? "white" : "#f9fafb",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "#f9fafb",
                  }),
                }}
              />
            </div>

            {/* Movie Selector */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Select Movie:</label>
              <Select
                options={movieOptions}
                onChange={(e) => setMovieId(e.value)}
                className="rounded-md bg-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "#4b5563",
                    color: "#f9fafb",
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: "#f9fafb",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: "#4b5563",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#6366f1"
                      : state.isFocused
                        ? "#4b5563"
                        : undefined,
                    color: state.isSelected ? "white" : "#f9fafb",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "#f9fafb",
                  }),
                }}
              />
            </div>

            {/* Screening Time Picker */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Screening Time:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={screeningTime}
                  onChange={(e) => setScreeningTime(e)}
                  className="text-white"
                  minDateTime={dayjs()}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="rounded-md bg-gray-600 px-4 py-2 text-white"
                      style={{ color: "white" }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>

            {/* Ticket Price Field */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Ticket Price:</label>
              <input
                className="w-full rounded-md border border-gray-700 bg-gray-600 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                type="number"
                min={0}
                value={seatPrice}
                onChange={(e) => setSeatPrice(parseInt(e.target.value))}
              />
            </div>

            {/* Feedback Messages */}
            {warning && (
              <div className="mt-2 font-bold text-red-600">{warning}</div>
            )}
            {message && (
              <div className="mt-2 font-bold text-green-600">{message}</div>
            )}

            {/* Submit Button */}
            <button
              className="mt-4 w-full rounded-md bg-blue-600 py-2 font-semibold text-white focus:outline-none"
              type="submit"
              disabled={isLoading}
            >
              {!isLoading ? "Submit" : <ClipLoader color="white" size={20} />}
            </button>
          </form>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white focus:outline-none">
              <Link href="../operations/screening/room-schedule">
                Check Room Schedule
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

export default ScreeningOperationsPage;
