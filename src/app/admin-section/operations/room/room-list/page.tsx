"use client";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  getAllCinemaRooms,
  deleteRoom,
  getSpecifiedRoom,
  deleteAllRoomSeats,
} from "~/app/server-actions";
import AdminSeatMap from "~/app/components/AdminSeatMap";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const RoomList = () => {
  const cinemaId = "677cd70b-e1b5-48fc-a6a9-0dadd71775c8";
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [loadingStates, setLoadingStates] = useState({});
  const [warnings, setWarnings] = useState({}); // State to track warnings for each layout
  const context = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../../admin-section");
    async function fetchRooms() {
      try {
        const allRooms = await getAllCinemaRooms(cinemaId);
        if (!allRooms) {
          return;
        }
        const roomObjArr = allRooms.map((room) => ({
          id: room?.id,
          number: room?.number,
          capacity: room?.capacity,
          screeningArr: room?.screenings,
          layout: room?.layout,
        }));
        setRooms(roomObjArr);
        setLoading(false); // Set loading to false after rooms are fetched
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    }
    fetchRooms();
  }, []);

  const handleDeleteRoom = async (roomId, index) => {
    try {
      setWarnings((prevWarnings) => ({
        ...prevWarnings,
        [roomId]: "", // Reset warning for the layout
      }));
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [roomId]: true, // Set loading state to true for the current deletion
      }));
      const room = await getSpecifiedRoom(roomId);
      if (!room) return;
      if (room.screenings.length > 0) {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [roomId]: "Cannot delete room. Currently in use.", // Set warning for the layout
        }));
        return;
      }
      await deleteAllRoomSeats(roomId);
      await deleteRoom(roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
    } finally {
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [roomId]: false, // Reset loading state after deletion is complete
      }));
    }
  };

  return (
    <div className="min-h-screen rounded-lg bg-gray-900 p-6 shadow-lg">
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <ClipLoader color="#4F46E5" size={35} />
        </div>
      ) : (
        rooms.map((room, index) => (
          <div
            key={index}
            className="mb-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm transition-all hover:shadow-lg"
          >
            <div className="text-lg font-bold text-white">
              Room Number: {room.number}
            </div>
            <div className="text-gray-400">Capacity: {room.capacity}</div>
            <AdminSeatMap
              rows={room.layout.rows}
              columns={room.layout.columns}
            ></AdminSeatMap>
            {warnings[room.id] && (
              <div className="mt-2 font-bold text-red-600">
                {warnings[room.id]}
              </div>
            )}
            <button
              onClick={async () => await handleDeleteRoom(room.id, index)}
              disabled={loadingStates[room.id]}
              className={`mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none ${loadingStates[room.id] ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {loadingStates[room.id] ? (
                <ClipLoader color="white" size={20}></ClipLoader>
              ) : (
                "Delete Room"
              )}
            </button>
          </div>
        ))
      )}
      {rooms.length === 0 && !loading && (
        <div className="text-center text-2xl font-bold text-white">
          There are no rooms
        </div>
      )}
      <Link href="../room">
        <div className="mt-4 flex justify-start">
          <div className="w-32 rounded bg-blue-500 px-4 py-2 text-center text-white transition duration-200 hover:bg-blue-600">
            Back
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RoomList;
