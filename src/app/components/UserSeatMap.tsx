"use client";
import React, { useEffect, useState } from "react";
import {
  getAllRoomSeats,
  getSpecifiedLayout,
  createReservation,
  getSpecifiedScreening,
  updateSeat,
  updateScreening,
  getSpecifiedMovie,
} from "../server-actions";
import { useUserContext } from "../context";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import ReservationConfirmation from "./ReservationConfirmation";

const UserSeatMap = ({ screeningId, movieId }) => {
  const [loading, setLoading] = useState(false); // State to track loading state
  const [allSeats, setAllSeats] = useState([]);
  const [allBookedSeats, setAllBookedSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);
  const [rows, setRows] = useState();
  const [columns, setColumns] = useState();
  const [screening, setScreening] = useState();
  const [movie, setMovie] = useState();
  const router = useRouter();

  async function fetchSeats() {
    try {
      setLoading(true); // Set loading state to true while fetching seats
      const screening = await getSpecifiedScreening(screeningId);
      if (!screening) return;
      const screeningObj = {
        screeningId: screeningId,
        screeningTime: screening?.screening_time,
        roomNumber: screening.room.number,
        seatPrice: 10,
      };
      setScreening(screeningObj);
      const movie = await getSpecifiedMovie(movieId);
      if (!movie) return;
      const movieObj = {
        movieId: movieId,
        length: movie.length,
        title: movie.title,
      };
      setMovie(movieObj);
      const layout = await getSpecifiedLayout(screening.room.layoutId);
      if (!layout) return;
      setRows(layout.rows);
      setColumns(layout.columns);

      const seatArr = await getAllRoomSeats(screening.roomId);
      if (!seatArr || seatArr.length === 0) return;

      setAllSeats(seatArr);

      const bookedSeatArr = seatArr.filter((seat) => {
        return (
          seat.reservations &&
          seat.reservations.some(
            (reservation) => reservation.screeningId === screeningId,
          )
        );
      });
      setAllBookedSeats(bookedSeatArr);
    } catch (error) {
      console.log("An error occurred while fetching seats:", error);
    } finally {
      setLoading(false); // Set loading state to false after fetching seats
    }
  }

  useEffect(() => {
    void fetchSeats();
  }, [movieId, screeningId]);

  const handleSeatClick = (seatId, seatNumber) => {
    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds((prevSelectedSeatIds) =>
        prevSelectedSeatIds.filter((id) => id !== seatId),
      );
      setSelectedSeatNumbers((prevSelectedSeatNumbers) =>
        prevSelectedSeatNumbers.filter((number) => number !== seatNumber),
      );
    } else {
      setSelectedSeatIds((prevSelectedSeatIds) => [
        ...prevSelectedSeatIds,
        seatId,
      ]);
      setSelectedSeatNumbers((prevSelectedSeatNumbers) => [
        ...prevSelectedSeatNumbers,
        seatNumber,
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      {loading ? ( // Display loading spinner while fetching seats
        <div className="my-4 flex justify-center">
          <ClipLoader color="#3B82F6" size={35} />
        </div>
      ) : (
        <div>
          <div
            className="grid grid-cols-12 gap-4"
            style={{
              gridTemplateRows: `repeat(${rows}, auto)`,
              gridTemplateColumns: `repeat(${columns}, auto)`,
            }}
          >
            {allSeats.map((seat) => (
              <button
                key={seat.id}
                className={`rounded-full p-4 text-lg font-bold ${
                  allBookedSeats.some((bSeat) => bSeat.id === seat.id)
                    ? "cursor-not-allowed bg-gray-700"
                    : selectedSeatIds.includes(seat.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white"
                } col-span-1`}
                disabled={allBookedSeats.some((bSeat) => bSeat.id === seat.id)}
                onClick={() => handleSeatClick(seat.id, seat.number)}
                style={{ margin: "5px" }}
              >
                {seat.number}
              </button>
            ))}
          </div>

          {selectedSeatIds.length > 0 && (
            <ReservationConfirmation
              movie={movie}
              screening={screening}
              seatNumbers={selectedSeatNumbers}
              selectedSeatIds={selectedSeatIds}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserSeatMap;
