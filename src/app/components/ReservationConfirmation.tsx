import React, { useEffect, useState } from "react";

import {
  createReservation,
  updateSeat,
  updateScreening,
  getSpecifiedScreening,
} from "../server-actions";
import { useUserContext } from "../context";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const ReservationConfirmation = ({
  movie,
  screening,
  seatNumbers,
  selectedSeatIds,
}) => {
  const context = useUserContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");

  const handleConfirmReservation = async () => {
    try {
      const fetchedScreening = await getSpecifiedScreening(
        screening.screeningId,
      );
      setMessage("");
      setIsLoading(true);
      const reservation = await createReservation({
        userId: context.currentUserId,
        screeningId: screening.screeningId,
        totalAmount: screening.seatPrice * seatNumbers.length,
      });
      if (!reservation.data) return;

      await Promise.all(
        selectedSeatIds.map(async (seatId) => {
          await updateSeat({
            seatId: seatId,
            reservationId: reservation.data.id,
          });
        }),
      );
      await updateScreening({
        screeningId: screening.screeningId,
        availableSeats:
          fetchedScreening?.available_seats - selectedSeatIds.length,
      });

      setIsLoading(false);
      setWarning("");
      setMessage("Reservation created");
      router.push("../mainpage/user-reservations");
    } catch (error) {
      setWarning("An error occurred while creating reservation");
      console.log("Error:", error);
    }
  };

  return (
    <div className=" bg-gray-900 p-4 text-white">
      <div className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-4">
        <div className="text-xl font-bold">Reservation confirmation</div>
        <div>Date: {new Date(screening.screeningTime).toLocaleString()}</div>
        <div>Movie: {movie.title}</div>
        <div>Length: {movie.length} Minutes</div>
        <div>
          Seats:
          {seatNumbers.map((seatNumber, seatIndex) => (
            <span key={seatIndex}>
              {seatNumber}
              {seatIndex !== seatNumbers.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
        <div>
          Amount: ${(screening.seatPrice * seatNumbers.length).toFixed(2)}
        </div>
        {warning && <div className="font-bold text-red-500">{warning}</div>}
        {message && <div className="font-bold text-green-500">{message}</div>}

        <button
          onClick={async () => await handleConfirmReservation()}
          disabled={isLoading}
          className={`mt-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isLoading ? <ClipLoader color="white" size={20} /> : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ReservationConfirmation;
