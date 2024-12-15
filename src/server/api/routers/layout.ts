import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import { fetchAllLayouts,fetchSpecifiedLayout,createLayout,deleteLayout } from "~/server/db";


export const layoutRouter=createTRPCRouter({
    getAllLayouts:publicProcedure.query(async()=>{
        const layoutsDbArray=await fetchAllLayouts()
        return { message: "All layouts have been fetched(TRPC).", data: layoutsDbArray };
    }),
    createLayout:publicProcedure.input(z.object({name:z.string(),rows:z.number(),columns:z.number(),totalSeats:z.number(),seatMap:z.array(z.array(z.string()))}))
    .mutation(async(obj)=>{
        const newLayout=await createLayout({name:obj.input.name,rows:obj.input.rows,columns:obj.input.columns,totalSeats:obj.input.totalSeats,seatMap:obj.input.seatMap})
        return {message:'Layout added to database(TRPC).',data:newLayout}
    }),
    getSpecifiedLayout: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedLayout= await fetchSpecifiedLayout(arg.input);
        return { message: "Layout has been fetched(TRPC).", data: specifiedLayout };
      }),
      deleteLayout:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedLayout= await deleteLayout(obj.input)
          return { message: "Layout has been deleted(TRPC).", data:deletedLayout };
      })
    });
