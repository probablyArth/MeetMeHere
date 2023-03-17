import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import HMSroomService, { ROLE } from "../../services/HMS";

export const getByID = protectedProcedure
  .input(z.object({ meetingId: z.string() }))
  .query(async (req) => {
    return req.ctx.prisma.meeting.findUnique({
      where: {
        id: req.input.meetingId,
      },
    });
  });

export const getUpcoming = protectedProcedure.query(async (req) => {
  return req.ctx.prisma.meeting.findMany({
    where: {
      OR: [
        {
          creator: {
            userId: req.ctx.session.user.id,
          },
        },
        {
          invitees: {
            some: {
              user: {
                id: req.ctx.session.user.id,
              },
              status: {
                not: "rejected",
              },
            },
          },
        },
      ],
      status: { not: "ended" },
    },
    include: {
      creator: {
        include: {
          user: true,
        },
      },
      invitees: {
        include: {
          user: true,
        },
      },
    },
  });
});

export const getAuthToken = protectedProcedure
  .input(z.object({ meeting_id: z.string() }))
  .query(async (req) => {
    const meeting = await req.ctx.prisma.meeting.findFirst({
      where: {
        OR: [
          {
            creator: {
              userId: req.ctx.session.user.id,
            },
          },
          {
            invitees: {
              some: {
                user: {
                  id: req.ctx.session.user.id,
                },
                status: {
                  not: "rejected",
                },
              },
            },
          },
        ],
        status: { not: "ended" },
        id: req.input.meeting_id,
      },
      include: {
        creator: {
          include: {
            user: true,
          },
        },
        invitees: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!meeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meeting not found!",
      });
    }
    let role: ROLE = ROLE.invitee;
    if (meeting.creator?.userId === req.ctx.session.user.id)
      role = ROLE.creator;

    if (meeting.status === "upcoming") {
      return { role, authToken: null };
    }
    return {
      role,
      authToken: HMSroomService.generateAuthToken(
        meeting.roomId as string,
        req.ctx.session.user.id,
        role
      ),
    };
  });
