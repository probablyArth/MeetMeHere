import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getRate: protectedProcedure.query(async (req) => {
    return req.ctx.prisma.user
      .findUnique({
        where: {
          id: req.ctx.session.user.id,
        },
      })
      .then((res) => res?.rate);
  }),
  delete: protectedProcedure.mutation(async (req) => {
    return req.ctx.prisma.user.delete({
      where: {
        id: req.ctx.session.user.id,
      },
    });
  }),
  addRate: protectedProcedure.input(z.number()).mutation((req) => {
    return req.ctx.prisma.user.update({
      where: { id: req.ctx.session.user.id },
      data: {
        rate: req.input,
      },
    });
  }),
  existsBygmail: protectedProcedure.input(z.string()).query((req) => {
    return req.ctx.prisma.user
      .findUnique({
        where: { email: req.input },
      })
      .then((user) => {
        if (user === null) {
          return false;
        }
        return true;
      });
  }),
});
