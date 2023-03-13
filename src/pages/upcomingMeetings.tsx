import { Creator, Invitee, Meeting, User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { FC } from "react";
import { api } from "~/utils/api";

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
  return (
    <div className="flex min-h-[200px] w-full flex-col rounded-md p-4 shadow-md">
      <div className="text-left">
        <h1 className="text-2xl font-semibold">{meeting.title}</h1>
        <i>{meeting.description}</i>
      </div>
      <div className="flex justify-between">
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
          {/* {meeting.invitees.map((invitee, key) => {
            return <img
            src={invitee. as string}
            alt={meeting.creator.name as string}
            className="w-[64px] rounded-full"
          />
          })} */}
          {/* GOTTA THINK OF ANOTHER WAY OF INVITING PEOPLE TO THE MEETING, NEED ACTUAL USER OBJECT IN INPUT OR SHOULD WE FETCH? */}
        </div>
      </div>
    </div>
  );
};

const UpcomingMeetings: NextPage = () => {
  const upcomingMeetings = api.meeting.getUpcoming.useQuery();
  upcomingMeetings.data;
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
