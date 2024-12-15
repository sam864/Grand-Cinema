import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import { fetchAllRoomScreenings,fetchSpecifiedScreening,createScreening,deleteScreening,fetchAllMovieScreenings,updateScreening } from "~/server/db";


export const screeningRouter=createTRPCRouter({
    getAllRoomScreenings:publicProcedure.input(z.string()).query(async(obj)=>{
        const roomScreeningsDbArray=await fetchAllRoomScreenings(obj.input)
        return { message: "All room screenings have been fetched(TRPC).", data: roomScreeningsDbArray };
    }),
    createScreening:publicProcedure.input(z.object({roomId:z.string(),movieId:z.string(),availableSeats:z.number(),screeningTime:z.string(),seatPrice:z.number()}))
    .mutation(async(obj)=>{
        const newScreening=await createScreening({roomId:obj.input.roomId,movieId:obj.input.movieId,availableSeats:obj.input.availableSeats,screeningTime:obj.input.screeningTime,seatPrice:obj.input.seatPrice})
        return {message:'Screening added to database(TRPC).',data:newScreening}
    }),
    getSpecifiedScreening: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedScreening= await fetchSpecifiedScreening(arg.input);
        return { message: "Screening has been fetched(TRPC).", data: specifiedScreening };
      }),
      deleteScreening:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedScreening= await deleteScreening(obj.input)
          return { message: "Screening has been deleted(TRPC).", data:deletedScreening };
      }), getAllMovieScreenings:publicProcedure.input(z.string()).query(async(obj)=>{
        const movieScreeningsDbArray=await fetchAllMovieScreenings(obj.input)
        return { message: "All movie screenings have been fetched(TRPC).", data: movieScreeningsDbArray };
    }),
    updateScreening:publicProcedure.input(z.object({screeningId:z.string(),availableSeats:z.number()})).mutation(async(obj)=>{
        const updatedScreening=await updateScreening({screeningId:obj.input.screeningId,availableSeats:obj.input.availableSeats})
        return { message: "Screening has been updated(TRPC).", data: updatedScreening };
    })
      
    });
