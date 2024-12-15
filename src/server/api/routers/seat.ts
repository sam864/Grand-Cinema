import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { fetchReservationSeats, updateSeat } from "~/server/db";
import { fetchAllRoomSeats,fetchSpecifiedSeat,createSeat,deleteSeat,deleteAllRoomSeats } from "~/server/db";

export const seatRouter=createTRPCRouter({
    getAllRoomSeats:publicProcedure.input(z.string()).query(async(obj)=>{
        const roomSeatsDbArray=await fetchAllRoomSeats(obj.input)
        return { message: "All room seats have been fetched(TRPC).", data: roomSeatsDbArray };
    }),
    createSeat:publicProcedure.input(z.object({roomId:z.string(), number:z.string()}))
    .mutation(async(obj)=>{
        const newSeat=await createSeat({roomId:obj.input.roomId,number:obj.input.number})
        return {message:'Seat added to database(TRPC).',data:newSeat}
    }),
    getSpecifiedSeat: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedSeat= await fetchSpecifiedSeat(arg.input);
        return { message: "Seat has been fetched(TRPC).", data: specifiedSeat };
      }),
      deleteSeat:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedSeat= await deleteSeat(obj.input)
          return { message: "Seat has been deleted(TRPC).", data:deletedSeat };
      }),
      updateSeat:publicProcedure.input(z.object({seatId:z.string(),reservationId:z.string() ||undefined}))
      .mutation(async(obj)=>{
        const updatedSeat=await updateSeat({seatId:obj.input.seatId,reservationId:obj.input.reservationId})
        return { message: "Seat has been updated(TRPC).", data: updatedSeat };
      }),
      getReservationSeats:publicProcedure.input(z.string()).query(async(obj)=>{
        const reservationSeats=await fetchReservationSeats(obj.input)
        return { message: "Reservation seats have been fetched(TRPC).", data: reservationSeats };
      }),
      deleteAllRoomSeats:publicProcedure.input(z.string()).mutation(async(obj)=>{
        const deletedSeats=await deleteAllRoomSeats(obj.input)
        return { message: "Seats have been deleted(TRPC).", data: deletedSeats };
      })
    });
