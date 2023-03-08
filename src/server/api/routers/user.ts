import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
  getRate: protectedProcedure.query(async (req) => {
    return prisma.user
      .findUnique({
        where: {
          id: req.ctx.session.user.id,
        },
      })
      .then((res) => res?.rate);
  }),
  delete: protectedProcedure.mutation(async (req) => {
    return prisma.user.delete({
      where: {
        id: req.ctx.session.user.id,
      },
    });
  }),
  addRate: protectedProcedure.input(z.number()).mutation((req) => {
    return prisma.user.update({
      where: { id: req.ctx.session.user.id },
      data: {
        rate: req.input,
      },
    });
  }),
});
