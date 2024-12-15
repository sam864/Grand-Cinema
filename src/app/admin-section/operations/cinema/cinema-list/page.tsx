"use client";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  getAllCinemas,
  getSpecifiedCinema,
  deleteCinema,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const CinemaList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [warnings, setWarnings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const context = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
    async function fetchCinemas() {
      try {
        const allCinemas = await getAllCinemas();
        if (!allCinemas) {
          return;
        }
        const cinemaObjArr = allCinemas.map((cinema) => ({
          id: cinema?.id,
          name: cinema?.name,
          numberOfRooms: cinema?.number_of_rooms,
          roomArr: cinema?.rooms,
        }));
        setCinemas(cinemaObjArr);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    }
    fetchCinemas();
  }, []);

  const handleDeleteCinema = async (cinemaId, index) => {
    try {
      setWarnings((prevWarnings) => ({
        ...prevWarnings,
        [cinemaId]: "",
      }));
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [cinemaId]: true,
      }));
      const cinema = await getSpecifiedCinema(cinemaId);
      if (!cinema) return;
      if (cinema.rooms.length > 0) {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [cinemaId]: "Cannot delete cinema. Currently in use.",
        }));
        return;
      }
      await deleteCinema(cinemaId);
      setCinemas((prevCinemas) =>
        prevCinemas.filter((cinema) => cinema.id !== cinemaId),
      );
    } catch (error) {
      console.error("Error deleting cinema:", error);
    } finally {
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [cinemaId]: false,
      }));
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <ClipLoader color="#4F46E5" size={35} />
        </div>
      ) : (
        cinemas.map((cinema, index) => (
          <div key={index} className="mb-4 border border-gray-200 p-4">
            <div className="font-bold">Cinema {index + 1}</div>
            <div>Name: {cinema.name}</div>
            <div>Number of rooms: {cinema.numberOfRooms}</div>
            {warnings[cinema.id] && (
              <div className="font-bold text-red-600">
                {warnings[cinema.id]}
              </div>
            )}
            <button
              onClick={async () => await handleDeleteCinema(cinema.id, index)}
              disabled={loadingStates[cinema.id]}
              className={`mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 ${
                loadingStates[cinema.id] ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loadingStates[cinema.id] ? (
                <ClipLoader color="white" size={20}></ClipLoader>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        ))
      )}
      <Link href="../cinema">
        <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
          Back
        </div>
      </Link>
    </div>
  );
};

export default CinemaList;
