import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";

export const useCreateMeeting = (closeModal: () => void) => {
  const createMeeting = api.meeting.create.useMutation({
    onSuccess: () => {
      closeModal();
      notifications.show({
        title: "Success",
        color: "green",
        message: "successfully created a meeting dawg",
      });
    },
    onError: () => {
      notifications.show({
        title: "Error!",
        color: "red",
        message: "An error occurred while creating a new meeting :(",
      });
    },
  });

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
