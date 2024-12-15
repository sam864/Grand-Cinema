"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useUserContext } from "~/app/context";
import UserSeatMap from "~/app/components/UserSeatMap";
import { getAllMovieScreenings } from "~/app/server-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Booking = () => {
  const context = useUserContext();
  const [showtimeOptions, setShowtimeOptions] = useState([]);
  const [screeningId, setScreeningId] = useState("");

  const router = useRouter();
  async function fetchShowtimes() {
    const screenings = await getAllMovieScreenings(context.selectedMovieId);
    if (screenings === undefined) return;

    const currentDateTime = new Date();
    const showtimeArr = [];

    screenings.forEach((screening) => {
      if (new Date(screening.screening_time) >= currentDateTime) {
        // Filter out screenings before the current time
        showtimeArr.push({
          label: new Date(screening.screening_time).toLocaleString(),
          value: screening.id,
        });
      }
    });

    setShowtimeOptions(showtimeArr);
  }

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId === "" || !currentUserId) {
      router.push("../../login-section");
    }
    void fetchShowtimes();
  }, []);
  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div>
        <label className="mb-1 text-lg font-semibold">Showtimes:</label>
        <Select
          options={showtimeOptions}
          onChange={(e) => {
            setScreeningId(e.value);
          }}
          className="w-72 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: "#4b5563", // Match the background color for the control
              color: "#f9fafb", // Ensure input text color is white (same as row text)
            }),
            input: (provided) => ({
              ...provided,
              color: "#f9fafb", // Ensure input text color is white (same as row text)
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "#4b5563", // Set background color for the dropdown menu
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? "#6366f1"
                : state.isFocused
                  ? "#4b5563" // Slightly darker when focused/hovered
                  : undefined,
              color: state.isSelected ? "white" : "#f9fafb", // Text color (white when selected)
              padding: "8px 12px", // Add some padding for better row spacing
              cursor: "pointer", // Add pointer cursor for better UX
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "#f9fafb", // Match the text color with the row
            }),
          }}
        ></Select>
      </div>

      <div className=" mt-2">
        <UserSeatMap
          screeningId={screeningId}
          movieId={context.selectedMovieId}
        />
      </div>

      <Link href="../mainpage">
        <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-600 p-2 text-center text-white hover:bg-blue-700 focus:outline-none">
          Back
        </div>
      </Link>
    </div>
  );
};

export default Booking;
