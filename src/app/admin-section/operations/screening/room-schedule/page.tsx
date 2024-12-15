"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  getAllRoomScreenings,
  getAllCinemaRooms,
  deleteScreening,
  getSpecifiedRoom,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";
const RoomSchedule = () => {
  const cinemaId = "677cd70b-e1b5-48fc-a6a9-0dadd71775c8";
  const [roomId, setRoomId] = useState();
  const [roomOptions, setRoomOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [day, setDay] = useState();
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [screenings, setScreenings] = useState([]);
  const [deletionTrigger, setDeletionTrigger] = useState(false);
  const [deletingScreeningIds, setDeletingScreeningIds] = useState([]);
  const context = useUserContext();
  const router = useRouter();
  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../../admin-section");
    async function fetchRooms() {
      try {
        const rooms = await getAllCinemaRooms(cinemaId);
        if (!rooms) return;
        const roomArr = rooms.map((room) => ({
          label: room.number,
          value: room.id,
        }));
        setRoomOptions(roomArr);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    }
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    if (!roomId || !day) {
      setWarning("Fill all fields");
      setIsLoading(false);
      return;
    }
    try {
      const roomScreenings = await getAllRoomScreenings(roomId);
      if (!roomScreenings || roomScreenings.length === 0) {
        setWarning("No screenings found(this room has no screenings)");
        setIsLoading(false);
        setScreenings([]);
        return;
      }
      const targetDate = new Date(day);
      const screeningArr = roomScreenings.reduce((acc, roomScreening) => {
        const scheduledDate = new Date(roomScreening.screening_time);
        if (
          targetDate.getDate() === scheduledDate.getDate() &&
          targetDate.getMonth() === scheduledDate.getMonth() &&
          targetDate.getFullYear() === scheduledDate.getFullYear()
        ) {
          acc.push({
            id: roomScreening.id,
            movie: roomScreening.movie,
            screeningTime: new Date(
              roomScreening.screening_time,
            ).toLocaleString(),
            availableSeats: roomScreening.available_seats,
          });

          setMessage("Screenings fetched");
        }
        return acc;
      }, []);
      setScreenings(screeningArr);
      setIsLoading(false);
      if (screeningArr.length === 0) {
        setWarning("No screenings found on this day");
      } else setWarning("");
    } catch (error) {
      console.error("Error fetching screenings:", error);
      setIsLoading(false);
      setWarning("An error occurred while fetching screenings");
    }
  };

  useEffect(() => {
    async function fetchScreenings() {
      try {
        const roomScreenings = await getAllRoomScreenings(roomId);
        const targetDate = new Date(day);
        const screeningArr = roomScreenings.reduce((acc, roomScreening) => {
          const scheduledDate = new Date(roomScreening.screening_time);
          if (
            targetDate.getDate() === scheduledDate.getDate() &&
            targetDate.getMonth() === scheduledDate.getMonth() &&
            targetDate.getFullYear() === scheduledDate.getFullYear()
          ) {
            acc.push({
              id: roomScreening.id,
              movie: roomScreening.movie,
              screeningTime: new Date(
                roomScreening.screening_time,
              ).toLocaleString(),
              availableSeats: roomScreening.available_seats,
            });
          }
          return acc;
        }, []);
        setScreenings(screeningArr);
      } catch (error) {
        console.error("Error fetching screenings:", error);
        setScreenings([]);
      }
    }
    fetchScreenings();
  }, [deletionTrigger]);

  const handleDeleteScreening = async (screening) => {
    setMessage("");
    const room = await getSpecifiedRoom(roomId);
    if (screening.availableSeats < room?.capacity) {
      setWarning("Cannot delete a screening with reservations");
      return;
    }
    try {
      setDeletingScreeningIds((prev) => [...prev, screening.id]); // Add the screening ID to the list of screenings being deleted
      await deleteScreening(screening.id);
      setMessage("Screening deleted");
      setDeletionTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error deleting screening:", error);
      setWarning("An error occurred while deleting screening");
    } finally {
      setDeletingScreeningIds((prev) =>
        prev.filter((id) => id !== screening.id),
      ); // Remove the screening ID from the list after deletion
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="mb-2 block">Select Room:</label>
        <Select
          options={roomOptions}
          onChange={(e) => setRoomId(e.value)}
          placeholder="Select Room"
          className="w-48 rounded-md bg-gray-700 text-white"
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
        <div>
          <label className="mb-2 block">Day:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={day} onChange={(e) => setDay(e)} />
          </LocalizationProvider>
        </div>
        {warning && <div className="font-bold text-red-500">{warning}</div>}
        {message && <div className="font-bold text-green-500">{message}</div>}
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader color="white" size={20} /> : "Submit"}
        </button>
      </form>

      {screenings.length > 0 && (
        <div className="mt-4 space-y-4">
          {screenings.map((screening, index) => (
            <div
              key={index}
              className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-4"
            >
              <div className="font-bold text-white">Screening {index + 1}</div>
              <div className="text-white">
                Screening Time: {screening.screeningTime}
              </div>
              <div className="text-white">Movie: {screening.movie.title}</div>
              <div className="text-white">
                Available Seats: {screening.availableSeats}
              </div>
              <button
                className="mt-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                onClick={async () => {
                  await handleDeleteScreening(screening);
                }}
                disabled={deletingScreeningIds.includes(screening.id)} // Disable the button while the screening is being deleted
              >
                {deletingScreeningIds.includes(screening.id) ? (
                  <ClipLoader color="white" size={20} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
        <Link href="../screening">Back</Link>
      </button>
    </div>
  );
};

export default RoomSchedule;
