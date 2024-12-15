import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import { fetchAllCinemas,fetchSpecifiedCinema,createCinema,deleteCinema } from "~/server/db";


export const cinemaRouter=createTRPCRouter({
    getAllCinemas:publicProcedure.query(async()=>{
        const cinemasDbArray=await fetchAllCinemas()
        return { message: "All cinemas have been fetched(TRPC).", data: cinemasDbArray };
    }),
    createCinema:publicProcedure.input(z.object({name:z.string(),numberOfRooms:z.number()}))
    .mutation(async(obj)=>{
        const newCinema=await createCinema({name:obj.input.name,numberOfRooms:obj.input.numberOfRooms})
        return {message:'Cinema added to database(TRPC).',data:newCinema}
    }),
    getSpecifiedCinema: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedCinema= await fetchSpecifiedCinema(arg.input);
        return { message: "Cinema has been fetched(TRPC).", data: specifiedCinema };
      }),
      deleteCinema:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedCinema= await deleteCinema(obj.input)
          return { message: "Cinema has been deleted(TRPC).", data:deletedCinema };
      })
    });
