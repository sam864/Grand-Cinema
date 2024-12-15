/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  createRoom,
  getSpecifiedRoom,
  getSpecifiedLayout,
  getAllLayouts,
  createSeat,
  getAllCinemaRooms,
  getSpecifiedCinema,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const RoomOperationsPage = () => {
  const [capacity, setCapacity] = useState<number>();
  const [layoutId, setLayoutId] = useState("");
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cinemaId = "677cd70b-e1b5-48fc-a6a9-0dadd71775c8";
  const context = useUserContext();
  const router = useRouter();
  const [layoutOptions, setLayoutOptions] = useState([]);

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
    async function fetchLayouts() {
      try {
        const layouts = await getAllLayouts();
        if (layouts) {
          const layoutArr = layouts.map((layout) => ({
            label: `${layout.name}-${layout.total_seats} seats`,
            value: layout.id,
          }));
          setLayoutOptions(layoutArr);
        }
      } catch (error) {
        console.error("Error fetching layouts:", error);
      }
    }

    fetchLayouts();
  }, []);

  const buildSeats = async (roomId: string) => {
    try {
      const room = await getSpecifiedRoom(roomId);
      const layout = await getSpecifiedLayout(room?.layoutId);
      if (room && layout) {
        const rows = layout.rows;
        const columns = layout.columns;
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            const newSeat = await createSeat({
              roomId: room.id,
              number: layout.seat_map[i][j],
            });
            console.log("New seat:", newSeat.data);
          }
        }
      }
    } catch (error) {
      console.error("Error building seats:", error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setWarning("");
    setIsLoading(true);

    try {
      if (!capacity || !layoutId) {
        setWarning("Please fill all fields");
        setIsLoading(false);
        return;
      }

      const cinemaRooms = await getAllCinemaRooms(cinemaId);
      const cinema = await getSpecifiedCinema(cinemaId);

      if (!cinema || !cinemaRooms) {
        setWarning("Error fetching cinema data");
        setIsLoading(false);
        return;
      }

      if (cinemaRooms.length >= cinema.number_of_rooms) {
        setWarning("Cannot create room. Max capacity reached.");
        setIsLoading(false);
        return;
      }

      const layout = await getSpecifiedLayout(layoutId);

      if (!layout) {
        setWarning("Error fetching layout data");
        setIsLoading(false);
        return;
      }
      console.log(layout.total_seats);
      console.log(capacity);
      if (layout.total_seats !== capacity) {
        setWarning("Room capacity has to match layout seat count.");
        setIsLoading(false);
        return;
      }

      const newRoom = await createRoom({
        cinemaId,
        capacity,
        roomNumber: `Room ${cinemaRooms.length + 1}`,
        layoutId,
      });

      if (newRoom.data) {
        await buildSeats(newRoom.data.id);
        setMessage("Room created");
      } else {
        setWarning("Error creating room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setWarning("An error occurred while creating room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-8 shadow-xl">
        <h1 className="mb-8 bg-clip-text text-center text-4xl font-semibold  text-white">
          Room Operations
        </h1>

        <div className="rounded-lg bg-gray-700 p-6">
          <h3 className="mb-4 text-xl font-semibold text-white">Create Room</h3>
          <form className="space-y-4" onSubmit={handleCreateRoom}>
            {/* Capacity Field */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Capacity:</label>
              <input
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                min={0}
                step={5}
                value={capacity || ""}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
              />
            </div>

            {/* Layout Selector */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Select a Layout:</label>
              <Select
                options={layoutOptions}
                onChange={(e) => setLayoutId(e.value)}
                className="rounded-md bg-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
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
              className="mt-4 w-full rounded-md bg-blue-600 py-2 font-semibold text-white  focus:outline-none"
              type="submit"
              disabled={isLoading}
            >
              {!isLoading ? "Submit" : <ClipLoader color="white" size={20} />}
            </button>
          </form>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="w-full rounded-md    bg-blue-600 py-2 font-semibold text-white focus:outline-none">
              <Link href="../operations/room/room-list">Check Room List</Link>
            </button>
            <Link href="../operations">
              <div className="w-full rounded-md  bg-blue-600  px-4 py-2 text-center text-white  focus:outline-none">
                Back
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomOperationsPage;
