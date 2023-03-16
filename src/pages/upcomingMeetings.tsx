import { Creator, Invitee, Meeting, User } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { api } from "~/utils/api";
import { AiFillDelete } from "react-icons/ai";
import { Button, LoadingOverlay } from "@mantine/core";
import Link from "next/link";

const MeetingsSkeleton: FC = () => {
  return (
    <div className="z-[-1] flex h-[250px] w-full flex-col justify-center gap-[50px] rounded-md p-8 shadow-sm">
      <div className="flex animate-pulse flex-col gap-2">
        <div className="h-[30px] w-[80%] rounded-sm bg-slate-100"></div>
        <div className="h-[25px] w-[60%] rounded-sm bg-slate-100"></div>
      </div>
      <div className="flex w-full  animate-pulse justify-between">
        <div className="h-[64px] w-[64px] rounded-full bg-slate-100"></div>
        <div className="flex">
          <div className="h-[64px] w-[64px] rounded-full bg-slate-200"></div>
          <div className="ml-[-20px] h-[64px] w-[64px] rounded-full bg-slate-100"></div>
        </div>
      </div>
    </div>
  );
};

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
    return (
      <>
        <MeetingsSkeleton />
        <MeetingsSkeleton />
        <MeetingsSkeleton />
        <MeetingsSkeleton />
        <MeetingsSkeleton />
      </>
    );
  }
  if (upcomingMeetings.status === "error") {
    return <h1>An Error Occurred</h1>;
  }
  if (
    upcomingMeetings.status === "success" &&
    upcomingMeetings.data.length === 0
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1>Looks like you don't have anything to look forward to!</h1>
        <Link
          href={"/dashboard"}
          className="rounded-md text-blue-900 underline hover:opacity-70"
        >
          Create a meeting
        </Link>
      </div>
    );
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
