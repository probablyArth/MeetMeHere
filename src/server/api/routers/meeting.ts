import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getByID, getUpcoming, getAuthToken } from "./meeting/queries";
import {
  create,
  deleteMeeting,
  setMeetingStatus,
  updateInviteeStatus,
} from "./meeting/mutations";

export const meetingRouter = createTRPCRouter({
  getByID,
  getUpcoming,
  getAuthToken,

  create,
  delete: deleteMeeting,
  updateInviteeStatus,
  setMeetingStatus,
});
