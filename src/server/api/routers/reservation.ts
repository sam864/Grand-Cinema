import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import { fetchAllUserReservations,fetchSpecifiedReservation,createReservation,deleteReservation } from "~/server/db";


export const reservationRouter=createTRPCRouter({
    getAllUserReservations:publicProcedure.input(z.string()).query(async(obj)=>{
        const userReservationsDbArray=await fetchAllUserReservations(obj.input)
        return { message: "All user reservations have been fetched(TRPC).", data: userReservationsDbArray };
    }),
    createReservation:publicProcedure.input(z.object({userId:z.string(),screeningId:z.string(),totalAmount:z.number()}))
    .mutation(async(obj)=>{
        const newReservation=await createReservation({userId:obj.input.userId,screeningId:obj.input.screeningId,totalAmount:obj.input.totalAmount})
        return {message:'Reservation added to database(TRPC).',data:newReservation}
    }),
    getSpecifiedReservation: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedReservation= await fetchSpecifiedReservation(arg.input);
        return { message: "Reservation has been fetched(TRPC).", data: specifiedReservation };
      }),
      deleteReservation:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedReservation= await deleteReservation(obj.input)
          return { message: "Cinema has been deleted(TRPC).", data:deletedReservation };
      })
    });
