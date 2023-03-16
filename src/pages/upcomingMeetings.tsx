import { Creator, Invitee, InviteeStatus, Meeting, User } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { AiFillDelete } from "react-icons/ai";
import {
  Indicator,
  LoadingOverlay,
  Mark,
  Spoiler,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

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

const evaluateUpcomingTimeString = (day: Date): string => {
  const diffDays = dayjs(day).diff(Date.now(), "days");
  const diffHours = dayjs(day).diff(Date.now(), "hours");
  const diffMinutes = dayjs(day).diff(Date.now(), "minutes");
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffHours > 1) return `In ${diffHours} hours`;
  return `In ${diffMinutes} minutes`;
};

const IndicatorColors = {
  accepted: "green",
  neutral: "yellow",
  rejected: "red",
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
  const updateInviteeStatus = api.meeting.updateInviteeStatus.useMutation({
    onSuccess: () => context.meeting.invalidate(),
  });
  const [upcominTimeString, setUpcomingTimeString] = useState(
    evaluateUpcomingTimeString(meeting.dateTime)
  );

  useEffect(() => {
    setInterval(() => {
      setUpcomingTimeString(evaluateUpcomingTimeString(meeting.dateTime));
    });
  }, []);

  return (
    <>
      <div className="relative flex min-h-[200px] w-full flex-col rounded-md p-5 shadow-md">
        <LoadingOverlay visible={deleteMeeting.isLoading} overlayBlur={2} />
        <div className="flex w-full justify-between gap-2">
          <div className="flex flex-col items-start justify-start text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{meeting.title}</h1>
              <Tooltip label={upcominTimeString}>
                <Mark color="blue">
                  {meeting.dateTime.toDateString()} @{" "}
                  {meeting.dateTime.getHours()}:{meeting.dateTime.getMinutes()}
                </Mark>
              </Tooltip>
              <h1></h1>
            </div>
            <Spoiler showLabel="..read more" hideLabel="hide" maxHeight={50}>
              <h3>{meeting.description}</h3>
            </Spoiler>
          </div>
          {session.data?.user.id === meeting.creator?.userId && (
            <button
              onClick={() => {
                deleteMeeting.mutate(meeting.id);
              }}
              className="flex items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-1 text-sm font-semibold text-white shadow-md hover:opacity-80"
            >
              <AiFillDelete size={24} /> <h1>Delete Meeting</h1>
            </button>
          )}
        </div>
        <div className="flex justify-between p-4">
          <div className="flex flex-col items-center">
            <h1>creator</h1>
            <Tooltip label={meeting.creator?.user.name as string}>
              <Image
                width={48}
                height={48}
                src={meeting.creator?.user.image as string}
                alt={meeting.creator?.user.name as string}
                className="rounded-full bg-gray-100"
              />
            </Tooltip>
          </div>
          <div>
            <h1>Invitees</h1>
            {meeting.invitees.map((invitee, key) => {
              return (
                <Tooltip label={invitee.user.name}>
                  <Indicator
                    color={IndicatorColors[invitee.status]}
                    offset={0}
                    position="bottom-center"
                  >
                    <Image
                      src={invitee.user.image as string}
                      alt={invitee.user.name as string}
                      key={key}
                      width={48}
                      height={48}
                      className="rounded-full bg-gray-100"
                    />
                  </Indicator>
                </Tooltip>
              );
            })}
          </div>
        </div>
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
