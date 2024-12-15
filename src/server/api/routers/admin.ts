import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";


import { fetchAllAdmins,fetchSpecifiedAdmin,createAdmin,deleteAdmin} from "~/server/db";


export const adminRouter = createTRPCRouter({
    getAllAdmins: publicProcedure.query(async () => {
      const adminsDbArray = await fetchAllAdmins();
      return { message: "All admins have been fetched(TRPC).", data: adminsDbArray };
    }),
    createAdmin: publicProcedure
      .input(z.object({accessId: z.string(), password: z.string()}))
      .mutation(async (obj) => {
        const newAdmin=await createAdmin({accessId: obj.input.accessId, password: obj.input.password});
        return {
          message: `Admin added to database(TRPC).`,data:newAdmin
        };
      }),
    getSpecifiedAdmin: publicProcedure.input(z.string()).query(async (obj) => {
      const specifiedAdmin= await fetchSpecifiedAdmin(obj.input);
      return { message: "Admin has been fetched(TRPC).", data: specifiedAdmin };
    }),
    deleteAdmin:publicProcedure.input(z.string()).mutation(async(obj)=>{
       const deletedAdmin= await deleteAdmin(obj.input)
        return { message: "Admin has been deleted(TRPC).", data:deletedAdmin };
    }),
  });
  