import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";


import { fetchAllUsers,fetchSpecifiedUser,createUser,deleteUser} from "~/server/db";


export const userRouter = createTRPCRouter({
    getAllUsers: publicProcedure.query(async () => {
      const usersDbArray = await fetchAllUsers();
      return { message: "All users have been fetched(TRPC).", data: usersDbArray };
    }),
    createUser: publicProcedure
      .input(z.object({email: z.string(), password: z.string()}))
      .mutation(async (obj) => {
        const newUser=await createUser({email: obj.input.email, password: obj.input.password});
        return {
          message: `User added to database(TRPC).`,data:newUser
        };
      }),
    getSpecifiedUser: publicProcedure.input(z.string()).query(async (obj) => {
      const specifiedUser= await fetchSpecifiedUser(obj.input);
      return { message: "User has been fetched(TRPC).", data: specifiedUser };
    }),
    deleteUser:publicProcedure.input(z.string()).mutation(async(obj)=>{
       const deletedUser= await deleteUser(obj.input)
        return { message: "User has been deleted(TRPC).", data:deletedUser };
    }),
  });
  