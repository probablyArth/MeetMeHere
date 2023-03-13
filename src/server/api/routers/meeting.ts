import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const meetingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        invitees: z.array(z.string()),
        dateTime: z.date(),
        duration: z.enum(["15", "30"]),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.meeting.create({
        data: {
          title: req.input.title,
          description: req.input.description,
          duration: req.input.duration,
          dateTime: req.input.dateTime,
          creatorId: req.ctx.session.user.id,
          invitees: {
            createMany: {
              data: req.input.invitees.map((gmail) => {
                return { gmail };
              }),
            },
          },
        },
      });
    }),
  getUpcoming: protectedProcedure.query(async (req) => {
    return req.ctx.prisma.meeting.findMany({
      where: {
        OR: [
          {
            creatorId: req.ctx.session.user.id,
          },
          {
            invitees: {
              some: {
                gmail: req.ctx.session.user.email as string,
              },
            },
          },
        ],
      },
      include: {
        creator: true,
        invitees: true,
      },
    });
  }),
});
