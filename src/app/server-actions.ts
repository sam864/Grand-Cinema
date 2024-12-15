'use server'
import { api} from "~/trpc/server"
import type { UserCreateInfo,CinemaCreateInfo,MovieCreateInfo,ReservationCreateInfo,
    RoomCreateInfo,ScreeningCreateInfo,SeatCreateInfo,LayoutCreateInfo, 
    SeatUpdateInfo,ScreeningUpdateInfo,AdminCreateInfo} from "~/server/db";
   
export const createUser = async ({ email, password}: UserCreateInfo) => {
    const newUser=await api.user.createUser.mutate({
      email,
      password
    });
    return newUser
  };
  
  export const getAllUsers = async () => {
    const allUsers = (await api.user.getAllUsers.query()).data;
    if (allUsers === undefined) return;
    return allUsers;
  };
  
  export const getSpecifiedUser = async (userId: string) => {
    const specifiedUser = (await api.user.getSpecifiedUser.query(userId)).data;
    return specifiedUser;
  };
 
  export const deleteUser=async(userId:string)=>{
    const deletedUser=(await api.user.deleteUser.mutate(userId)).data
    return deletedUser
  }
  export const createAdmin = async ({ accessId, password}: AdminCreateInfo) => {
    const newAdmin=await api.admin.createAdmin.mutate({
      accessId, password
    });
    return newAdmin
  };
  
  export const getAllAdmins = async () => {
    const allAdmins = (await api.admin.getAllAdmins.query()).data;
    if (allAdmins === undefined) return;
    return allAdmins;
  };
  
  export const getSpecifiedAdmin = async (adminId: string) => {
    const specifiedAdmin = (await api.admin.getSpecifiedAdmin.query(adminId)).data;
    return specifiedAdmin;
  };
 
  
  export const deleteAdmin=async(adminId:string)=>{
    const deletedAdmin=(await api.admin.deleteAdmin.mutate(adminId)).data
    return deletedAdmin
  }

  export const createCinema = async ({name, numberOfRooms }: CinemaCreateInfo) => {
    const newCinema=await api.cinema.createCinema.mutate({
    name,
    numberOfRooms
    });
    return newCinema
  };

  export const getAllCinemas = async () => {
    const allCinemas = (await api.cinema.getAllCinemas.query()).data;
    if (allCinemas === undefined) return;
    return allCinemas;
  };

  export const getSpecifiedCinema = async (cinemaId: string) => {
    const specifiedCinema = (await api.cinema.getSpecifiedCinema.query(cinemaId)).data;
    return specifiedCinema;
  };
  
  export const deleteCinema=async(cinemaId:string)=>{
    const deletedCinema=(await api.cinema.deleteCinema.mutate(cinemaId)).data
    return deletedCinema
  }

  export const createMovie = async ({title,length,releaseDate,description }: MovieCreateInfo) => {
    const newMovie=await api.movie.createMovie.mutate({
title,
releaseDate,
length,
description
    });
    return newMovie
  };

  export const getAllMovies = async () => {
    const allMovies = (await api.movie.getAllMovies.query()).data;
    if (allMovies === undefined) return;
    return allMovies;
  };

  export const getSpecifiedMovie = async (movieId: string) => {
    const specifiedMovie = (await api.movie.getSpecifiedMovie.query(movieId)).data;
    return specifiedMovie;
  };
  
export const deleteMovie=async(movieId:string)=>{
  const deletedMovie=(await api.movie.deleteMovie.mutate(movieId)).data
  return deletedMovie
}
  export const createScreening = async ({roomId,movieId,screeningTime,availableSeats,seatPrice }: ScreeningCreateInfo) => {
    const newScreening=await api.screening.createScreening.mutate({
movieId,
roomId,
availableSeats,
screeningTime,
seatPrice
    });
    return newScreening
  };

  export const getAllRoomScreenings = async (roomId:string) => {
    const allRoomScreenings = (await api.screening.getAllRoomScreenings.query(roomId)).data;
    if (allRoomScreenings === undefined) return;
    return allRoomScreenings;
  };

export const getAllMovieScreenings=async(movieId:string)=>{
  const allMovieScreenings=(await api.screening.getAllMovieScreenings.query(movieId)).data;
  if(!allMovieScreenings)return;
  return allMovieScreenings;
}

  export const getSpecifiedScreening = async (screeningId: string) => {
    const specifiedScreening = (await api.screening.getSpecifiedScreening.query(screeningId)).data;
    return specifiedScreening;
  };
  
export const updateScreening=async({screeningId,availableSeats}:ScreeningUpdateInfo)=>{
const updatedScreening=await api.screening.updateScreening.mutate({screeningId,availableSeats})
return updatedScreening
}

export const deleteScreening=async(screeningId:string)=>{
  const deletedScreening=(await api.screening.deleteScreening.mutate(screeningId)).data
  return deletedScreening
}

  export const createRoom = async ({cinemaId,roomNumber,capacity,layoutId}: RoomCreateInfo) => {
    const newRoom=await api.room.createRoom.mutate({
cinemaId,
roomNumber,
capacity,
layoutId
    });
    return newRoom
  };

  export const getAllCinemaRooms = async (cinemaId:string) => {
    const allCinemaRooms = (await api.room.getAllCinemaRooms.query(cinemaId)).data;
    if (allCinemaRooms === undefined) return;
    return allCinemaRooms;
  };

  export const getSpecifiedRoom = async (roomId: string) => {
    const specifiedRoom = (await api.room.getSpecifiedRoom.query(roomId)).data;
    return specifiedRoom;
  };
  
  export const deleteRoom=async(roomId:string)=>{
    const deletedRoom=(await api.room.deleteRoom.mutate(roomId)).data
    return deletedRoom
  }



  export const createSeat = async ({roomId,number}: SeatCreateInfo) => {
   const newSeat= await api.seat.createSeat.mutate({
roomId,
number
    });
    return newSeat
  };
  export const updateSeat = async ({seatId,reservationId}: SeatUpdateInfo) => {
    const updatedSeat= await api.seat.updateSeat.mutate({
 seatId,
 reservationId 
     });
     return updatedSeat
   };
 
   export const deleteSeat=async(seatId:string)=>{
    const deletedSeat=(await api.seat.deleteSeat.mutate(seatId)).data
    return deletedSeat
   }

   export const deleteAllRoomSeats=async(roomId:string)=>{
    const deletedSeats=(await api.seat.deleteAllRoomSeats.mutate(roomId)).data
    return deletedSeats
   }

  export const getAllRoomSeats = async (roomId:string) => {
    const allRoomSeats = (await api.seat.getAllRoomSeats.query(roomId)).data;
    if (allRoomSeats === undefined) return;
    return allRoomSeats;
  };

  export const getSpecifiedseat = async (seatId: string) => {
    const specifiedSeat = (await api.seat.getSpecifiedSeat.query(seatId)).data;
    return specifiedSeat;
  };
  
  export const getReservationSeats=async(reservationId:string)=>{
    const reservationSeats = (await api.seat.getReservationSeats.query(reservationId)).data;
    return reservationSeats;
  }

  export const createReservation = async ({screeningId,totalAmount,userId}: ReservationCreateInfo) => {
    const newReservation=await api.reservation.createReservation.mutate({
screeningId,
totalAmount,
userId
    });
    return newReservation
  };

  export const getAllUserReservations = async (userId:string) => {
    const allUserReservations = (await api.reservation.getAllUserReservations.query(userId)).data;
    if (allUserReservations === undefined) return;
    return allUserReservations;
  };

  export const getSpecifiedReservation = async (reservationId: string) => {
    const specifiedReservation = (await api.reservation.getSpecifiedReservation.query(reservationId)).data;
    return specifiedReservation;
  };

  export const deleteReservation=async(reservationId:string)=>{
    const deletedReservation=(await api.reservation.deleteReservation.mutate(reservationId)).data
    return deletedReservation
  }

   export const createLayout = async ({name, rows,columns,totalSeats,seatMap }: LayoutCreateInfo) => {
    const newLayout=await api.layout.createLayout.mutate({
    name,
    rows,
    columns,
    seatMap,
    totalSeats
    });
    return newLayout
  };

  export const getAllLayouts = async () => {
    const allLayouts = (await api.layout.getAllLayouts .query()).data;
    if (allLayouts === undefined) return;
    return allLayouts;
  };

  export const getSpecifiedLayout = async (layoutId: string) => {
    const specifiedLayout = (await api.layout.getSpecifiedLayout.query(layoutId)).data;
    return specifiedLayout;
  };

  export const deleteLayout=async(layoutId:string)=>{
    const deletedLayout=(await api.layout.deleteLayout.mutate(layoutId)).data
    return deletedLayout
  }