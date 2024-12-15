"use client";
import React, { useEffect, useState } from "react";
import {
  getAllUserReservations,
  getSpecifiedMovie,
  deleteReservation,
  updateScreening,
  getSpecifiedScreening,
  getSpecifiedReservation,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserReservations = () => {
  const context = useUserContext();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({}); // State to track loading for each deletion
  const router = useRouter();

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId === "" || !currentUserId) {
      router.push("../../login-section");
    }

    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await getAllUserReservations(context.currentUserId);
        if (data.length === 0) {
          setLoading(false);
          return;
        }
        const reservationArr = [];
        const loadingObj = {};
        for (let i = 0; i < data?.length; i++) {
          const movie = await getSpecifiedMovie(data[i]?.screening.movieId);
          const obj = {
            id: data[i]?.id, // Assuming each reservation has an ID
            screeningTime: new Date(
              data[i]?.screening.screening_time,
            ).toLocaleString(),
            movie: movie?.title,
            movieLength: movie?.length,
            seats: data[i]?.seats,
            totalAmount: data[i]?.total_amount,
          };
          reservationArr.push(obj);
          loadingObj[data[i]?.id] = false; // Initialize loading state for each reservation
        }
        setReservations(reservationArr);
        setLoadingStates(loadingObj);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId, index) => {
    try {
      setLoadingStates((prevState) => ({
        ...prevState,
        [reservationId]: true, // Set loading state to true for the current deletion
      }));
      const reservation = await getSpecifiedReservation(reservationId);
      const screening = await getSpecifiedScreening(reservation?.screening.id);
      await deleteReservation(reservationId);
      // After successful deletion, update reservations state
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId,
        ),
      );
      await updateScreening({
        screeningId: screening.id,
        availableSeats: screening?.available_seats + 1,
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
    } finally {
      setLoadingStates((prevState) => ({
        ...prevState,
        [reservationId]: false, // Reset loading state after deletion is complete
      }));
    }
  };

  return (
    <div className="h-screen bg-gray-900 p-4 text-white">
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <ClipLoader color="#4F46E5" size={35} />
        </div>
      ) : reservations.length === 0 ? (
        <div className="mt-10 text-center text-2xl font-bold text-white">
          No reservations found.
        </div>
      ) : (
        reservations.map((reservation, i) => (
          <div
            key={reservation.id}
            className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-4"
          >
            <div className="text-lg font-bold">Reservation #{i + 1}</div>
            <div>
              Screening Time:{" "}
              {new Date(reservation.screeningTime).toLocaleString()}
            </div>
            <div>Movie: {reservation.movie}</div>
            <div>Length: {reservation.movieLength} minutes</div>
            <div>
              Seats:{" "}
              {reservation.seats.map((seat, index) => (
                <span key={index}>
                  {seat.number}
                  {index !== reservation.seats.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
            <div>
              Amount: $
              {(reservation.totalAmount * reservation.seats.length).toFixed(2)}
            </div>
            <button
              onClick={() => handleDeleteReservation(reservation.id)}
              disabled={loadingStates[reservation.id]}
              className={`mt-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 ${
                loadingStates[reservation.id]
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              {loadingStates[reservation.id] ? (
                <ClipLoader color="white" size={20} />
              ) : (
                "Cancel"
              )}
            </button>
          </div>
        ))
      )}
      <Link href="../mainpage">
        <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          Back
        </button>
      </Link>
    </div>
  );
};

export default UserReservations;
