import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { meetingRouter } from "./routers/meeting";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  meeting: meetingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
