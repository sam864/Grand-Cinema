
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { cinemaRouter } from "./routers/cinema";
import { roomRouter } from "./routers/room";
import { movieRouter } from "./routers/movie";
import { screeningRouter } from "./routers/screening";
import { seatRouter } from "./routers/seat";
import { reservationRouter } from "./routers/reservation";
import { layoutRouter } from "./routers/layout";
import { adminRouter } from "./routers/admin";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
user:userRouter,
cinema:cinemaRouter,
room:roomRouter,
movie:movieRouter,
screening:screeningRouter,
seat:seatRouter,
reservation:reservationRouter,
layout:layoutRouter,
admin:adminRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
