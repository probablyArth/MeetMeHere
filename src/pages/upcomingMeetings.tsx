import { Creator, Invitee, Meeting, User } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { api } from "~/utils/api";
import { AiFillDelete } from "react-icons/ai";
import { LoadingOverlay } from "@mantine/core";

const UpcomingMeetingCard: FC<{
  meeting: Meeting & {
    creator:
      | (Creator & {
          user: User;
        })
      | null;
    invitees: (Invitee & {
      user: User;
    })[];
  };
}> = ({ meeting }) => {
  const context = api.useContext();
  const session = useSession();
  const deleteMeeting = api.meeting.delete.useMutation({
    onSuccess: () => context.meeting.invalidate(),
  });

  return (
    <>
      <div className="relative flex min-h-[200px] w-full flex-col rounded-md p-4 shadow-md">
        <LoadingOverlay visible={deleteMeeting.isLoading} overlayBlur={2} />
        <div className="text-left">
          <h1 className="text-2xl font-semibold">{meeting.title}</h1>
          <i>{meeting.description}</i>
        </div>
        <div className="flex justify-between p-4">
          <div className="flex flex-col items-center">
            <h1>creator</h1>
            <img
              src={meeting.creator?.user.image as string}
              alt={meeting.creator?.user.name as string}
              className="w-[64px] rounded-full"
            />
          </div>
          <div>
            <h1>Invitees</h1>
            {meeting.invitees.map((invitee, key) => {
              return (
                <img
                  src={invitee.user.image as string}
                  alt={invitee.user.name as string}
                  key={key}
                  className="w-[64px] rounded-full"
                />
              );
            })}
          </div>
        </div>
        {session.data?.user.id === meeting.creator?.userId && (
          <button
            onClick={() => {
              deleteMeeting.mutate(meeting.id);
            }}
          >
            <AiFillDelete />
          </button>
        )}
      </div>
    </>
  );
};

const UpcomingMeetings: NextPage = () => {
  const upcomingMeetings = api.meeting.getUpcoming.useQuery();
  if (upcomingMeetings.status === "loading") {
    return <h1>Loading</h1>;
  }
  if (upcomingMeetings.status === "error") {
    return <h1>An Error Occurred</h1>;
  }
  return (
    <>
      {upcomingMeetings.data.map((meeting, idx) => {
        return <UpcomingMeetingCard meeting={meeting} key={idx} />;
      })}
    </>
  );
};

export default UpcomingMeetings;
