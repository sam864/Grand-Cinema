import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import { fetchAllMovies,fetchSpecifiedMovie,createMovie,deleteMovie } from "~/server/db";


export const movieRouter=createTRPCRouter({
    getAllMovies:publicProcedure.query(async()=>{
        const moviesDbArray=await fetchAllMovies()
        return { message: "All movies have been fetched(TRPC).", data: moviesDbArray };
    }),
    createMovie:publicProcedure.input(z.object({title:z.string(),length:z.number(),releaseDate:z.string(),description:z.string()}))
    .mutation(async(obj)=>{
        const newMovie=await createMovie({title:obj.input.title,length:obj.input.length,releaseDate:obj.input.releaseDate,description:obj.input.description})
        return {message:'Movie added to database(TRPC).',data:newMovie}
    }),
    getSpecifiedMovie: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedMovie= await fetchSpecifiedMovie(arg.input);
        return { message: "Cinema has been fetched(TRPC).", data: specifiedMovie };
      }),
      deleteMovie:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedMovie= await deleteMovie(obj.input)
          return { message: "Cinema has been deleted(TRPC).", data:deletedMovie };
      })
    });
