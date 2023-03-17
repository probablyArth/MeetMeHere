import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { createId } from "@paralleldrive/cuid2";
import HMSroomService from "../../services/HMS";
import { TRPCError } from "@trpc/server";

export const create = protectedProcedure
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
    const meetingId = createId();
    const {
      data: { id: roomId },
    } = await HMSroomService.create(meetingId, req.input.description);
    return req.ctx.prisma.meeting.create({
      data: {
        id: meetingId,
        roomId,
        dateTime: req.input.dateTime,
        description: req.input.description,
        duration: req.input.duration,
        title: req.input.title,
        creator: {
          create: {
            userId: req.ctx.session.user.id,
          },
        },
        invitees: {
          createMany: {
            data: req.input.invitees.map((gmail) => {
              return { gmail };
            }),
          },
        },
      },
    });
  });

export const deleteMeeting = protectedProcedure
  .input(z.string())
  .mutation(async (req) => {
    const meeting = await req.ctx.prisma.meeting.findUnique({
      where: {
        id: req.input,
      },
      include: {
        creator: true,
      },
    });
    if (!meeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "meeting not found",
      });
    }
    if (req.ctx.session.user.id !== meeting.creator?.userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not the creator of this meeting",
      });
    }
    await HMSroomService.disable(meeting.roomId);
    await req.ctx.prisma.meeting.delete({
      where: {
        id: req.input,
      },
    });
  });

export const updateInviteeStatus = protectedProcedure
  .input(
    z.object({
      inviteeId: z.string(),
      newStatus: z.enum(["accepted", "rejected"]),
    })
  )
  .mutation(async (req) => {
    const invitee = req.ctx.prisma.invitee.findFirst({
      where: {
        id: req.input.inviteeId,
        user: {
          id: req.ctx.session.user.id,
        },
      },
    });
    if (!invitee) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "invitee not found",
      });
    }
    await req.ctx.prisma.invitee.update({
      where: {
        id: req.input.inviteeId,
      },
      data: {
        status: req.input.newStatus,
      },
    });
  });

export const setMeetingStatus = protectedProcedure
  .input(
    z.object({
      status: z.enum(["ongoing", "upcoming", "ended"]),
      meetingId: z.string(),
    })
  )
  .mutation(async (req) => {
    const meeting = req.ctx.prisma.meeting.findFirst({
      where: {
        id: req.input.meetingId,
        creator: { userId: req.ctx.session.user.id },
      },
    });
    if (!meeting) throw new TRPCError({ code: "NOT_FOUND" });
    return await req.ctx.prisma.meeting.update({
      where: {
        id: req.input.meetingId,
      },
      data: {
        status: req.input.status,
      },
    });
  });
