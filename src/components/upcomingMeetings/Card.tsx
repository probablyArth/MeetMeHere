import {
  Indicator,
  LoadingOverlay,
  Mark,
  Spoiler,
  Tooltip,
} from "@mantine/core";
import { Creator, Invitee, Meeting, User } from "@prisma/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { api } from "~/utils/api";

enum IndicatorColors {
  accepted = "green",
  neutral = "yellow",
  rejected = "red",
}

const InviteeAvatar: FC<{
  name: string;
  src: string;
  color?: IndicatorColors;
}> = ({ name, src, color }) => {
  return (
    <Tooltip label={name}>
      <Indicator color={color} offset={0} position="bottom-center" withBorder>
        <Image
          src={src}
          alt={name}
          width={48}
          height={48}
          className="rounded-full bg-gray-100"
        />
      </Indicator>
    </Tooltip>
  );
};

const evaluateUpcomingTimeString = (day: Date): string => {
  const diffDays = dayjs(day).diff(Date.now(), "days");
  const diffHours = dayjs(day).diff(Date.now(), "hours");
  const diffMinutes = dayjs(day).diff(Date.now(), "minutes");
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffHours > 1) return `In ${diffHours} hours`;
  if (diffMinutes < 1) return `${-1 * diffMinutes} minutes ago`;
  return `In ${diffMinutes} minutes`;
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
            <div className="flex items-center justify-center gap-2">
              {meeting.invitees.map((invitee, key) => {
                return (
                  <InviteeAvatar
                    name={invitee.user.name as string}
                    src={invitee.user.image as string}
                    color={IndicatorColors[invitee.status]}
                    key={key}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpcomingMeetingCard;
