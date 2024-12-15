import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import { fetchAllCinemaRooms,fetchSpecifiedRoom,createRoom,deleteRoom } from "~/server/db";


export const roomRouter=createTRPCRouter({
    getAllCinemaRooms:publicProcedure.input(z.string()).query(async(obj)=>{
        const cinemaRoomsDbArray=await fetchAllCinemaRooms(obj.input)
        return { message: "All rooms have been fetched(TRPC).", data: cinemaRoomsDbArray };
    }),
    createRoom:publicProcedure.input(z.object({cinemaId:z.string(),capacity:z.number(),roomNumber:z.string(),layoutId:z.string()}))
    .mutation(async(obj)=>{
        const newRoom=await createRoom({cinemaId:obj.input.cinemaId,capacity:obj.input.capacity,roomNumber:obj.input.roomNumber,layoutId:obj.input.layoutId})
        return {message:'Room added to database(TRPC).',data:newRoom}
    }),
    getSpecifiedRoom: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedRoom= await fetchSpecifiedRoom(arg.input);
        return { message: "Room has been fetched(TRPC).", data: specifiedRoom };
      }),
      deleteRoom:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedRoom= await deleteRoom(obj.input)
          return { message: "Room has been deleted(TRPC).", data:deletedRoom };
      })
    });
