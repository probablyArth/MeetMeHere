import { useRouter } from "next/router";
import { api } from "~/utils/api";

export const useCreateMeeting = () => {
  const router = useRouter();
  const createMeeting = api.meeting.create.useMutation();

  return async (data: {
    invitees: string[];
    title: string;
    description: string;
    dateTime: Date;
    duration: "15" | "30";
  }) => {
    createMeeting.mutate(data);
  };
};
